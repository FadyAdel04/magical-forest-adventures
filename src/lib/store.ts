import { resolveShippingFee } from "./shipping";
import { isSupabaseConfigured } from "./supabase";
import {
  deleteOrderFromSupabase,
  fetchAppDataFromSupabase,
  insertOrderToSupabase,
  nextOrderNumberFromSupabase,
  seedAppDataToSupabase,
  subscribeToSupabaseChanges,
  updateOrderStatusInSupabase,
  upsertCatalogToSupabase,
  upsertShippingToSupabase,
} from "./supabase-data";
import {
  createDefaultData,
  loadLocalStorageData,
  saveLocalStorageBackup,
} from "./store-defaults";
import type {
  AppData,
  OrderRecord,
  OrderStatus,
  ProductCatalog,
  ShippingSettings,
} from "./types";

export { createDefaultCatalog, createDefaultShipping } from "./store-defaults";

function uid() {
  return crypto.randomUUID();
}

function now() {
  return new Date().toISOString();
}

let cache: AppData = createDefaultData();
let isLoading = true;
let isReady = false;
let error: string | null = null;
let hydratePromise: Promise<void> | null = null;
let unsubscribeRealtime: (() => void) | null = null;

const listeners = new Set<() => void>();

function notify() {
  syncSnapshot();
  listeners.forEach((l) => l());
}

function persistLocal() {
  saveLocalStorageBackup(cache);
  notify();
}

export type StoreStatus = {
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  isRemote: boolean;
};

export type StoreSnapshot = AppData & StoreStatus;

function buildSnapshot(): StoreSnapshot {
  return {
    catalog: cache.catalog,
    orders: cache.orders,
    shipping: cache.shipping,
    isLoading,
    isReady,
    error,
    isRemote: isSupabaseConfigured,
  };
}

/** Stable reference for useSyncExternalStore — rebuilt only in notify(). */
let snapshot: StoreSnapshot = buildSnapshot();

function syncSnapshot() {
  snapshot = buildSnapshot();
}

export function getStoreStatus(): StoreStatus {
  return {
    isLoading: snapshot.isLoading,
    isReady: snapshot.isReady,
    error: snapshot.error,
    isRemote: snapshot.isRemote,
  };
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): AppData {
  return cache;
}

export function getStoreSnapshot(): StoreSnapshot {
  return snapshot;
}

async function pullFromSupabase() {
  const remote = await fetchAppDataFromSupabase();
  const local = loadLocalStorageData();

  if (local && local.orders.length > 0 && remote.orders.length === 0) {
    await seedAppDataToSupabase(local);
    cache = await fetchAppDataFromSupabase();
  } else {
    cache = remote;
  }
  saveLocalStorageBackup(cache);
}

async function pullFromLocal() {
  cache = loadLocalStorageData() ?? createDefaultData();
  saveLocalStorageBackup(cache);
}

export async function hydrateStore(): Promise<void> {
  if (hydratePromise) return hydratePromise;

  hydratePromise = (async () => {
    isLoading = true;
    error = null;
    notify();

    try {
      if (isSupabaseConfigured) {
        await pullFromSupabase();
        unsubscribeRealtime?.();
        unsubscribeRealtime = subscribeToSupabaseChanges(() => {
          void refreshStore({ silent: true });
        });
      } else {
        await pullFromLocal();
      }
      isReady = true;
    } catch (e) {
      const message = e instanceof Error ? e.message : "تعذّر تحميل البيانات";
      error = message;
      try {
        await pullFromLocal();
        isReady = true;
      } catch {
        cache = createDefaultData();
        isReady = true;
      }
    } finally {
      isLoading = false;
      notify();
    }
  })();

  return hydratePromise;
}

export async function refreshStore(options?: { silent?: boolean }): Promise<void> {
  if (!isSupabaseConfigured) return;
  if (!options?.silent) {
    isLoading = true;
    notify();
  }
  try {
    cache = await fetchAppDataFromSupabase();
    saveLocalStorageBackup(cache);
    error = null;
  } catch (e) {
    error = e instanceof Error ? e.message : "تعذّر تحديث البيانات";
  } finally {
    if (!options?.silent) {
      isLoading = false;
    }
    notify();
  }
}

export function getShippingFee(governorate: string): number {
  return resolveShippingFee(governorate, cache.shipping);
}

export async function replaceCatalog(catalog: ProductCatalog): Promise<void> {
  const updated = { ...catalog, updatedAt: now() };
  if (isSupabaseConfigured) {
    await upsertCatalogToSupabase(updated);
  }
  cache = { ...cache, catalog: updated };
  persistLocal();
}

export async function replaceShipping(shipping: ShippingSettings): Promise<void> {
  if (isSupabaseConfigured) {
    await upsertShippingToSupabase(shipping);
  }
  cache = { ...cache, shipping };
  persistLocal();
}

export type CreateOrderInput = {
  customerName: string;
  phone: string;
  governorate: string;
  address: string;
  notes: string;
  quantity: number;
};

export async function createOrder(input: CreateOrderInput): Promise<OrderRecord> {
  const unitPrice = cache.catalog.priceAfter;
  const shippingFee = getShippingFee(input.governorate);
  const subtotal = unitPrice * input.quantity;
  const total = subtotal + shippingFee;
  const t = now();

  const orderNumber = isSupabaseConfigured
    ? await nextOrderNumberFromSupabase()
    : nextOrderNumberLocal();

  const order: OrderRecord = {
    id: uid(),
    orderNumber,
    ...input,
    unitPrice,
    shippingFee,
    subtotal,
    total,
    status: "pending",
    createdAt: t,
    updatedAt: t,
  };

  if (isSupabaseConfigured) {
    const saved = await insertOrderToSupabase(order);
    cache = { ...cache, orders: [saved, ...cache.orders] };
  } else {
    cache = { ...cache, orders: [order, ...cache.orders] };
  }
  persistLocal();
  return cache.orders[0]!;
}

function nextOrderNumberLocal(): string {
  const year = new Date().getFullYear();
  const count = cache.orders.filter((o) => o.orderNumber.startsWith(`NSG-${year}`)).length + 1;
  return `NSG-${year}-${String(count).padStart(4, "0")}`;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const updatedAt = now();
  if (isSupabaseConfigured) {
    await updateOrderStatusInSupabase(id, status, updatedAt);
  }
  cache = {
    ...cache,
    orders: cache.orders.map((o) =>
      o.id === id ? { ...o, status, updatedAt } : o,
    ),
  };
  persistLocal();
}

export async function deleteOrder(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    await deleteOrderFromSupabase(id);
  }
  cache = { ...cache, orders: cache.orders.filter((o) => o.id !== id) };
  persistLocal();
}
