import { resolveShippingFee } from "./shipping";
import { isSupabaseConfigured } from "./supabase";
import {
  deleteOrderFromSupabase,
  fetchAppDataFromSupabase,
  insertOrderToSupabase,
  nextOrderNumberFromSupabase,
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
  CartItem,
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

// Debounce timer for realtime refreshes — prevents race conditions where
// the realtime event fires before Supabase has finished propagating the change.
let realtimeDebounceTimer: ReturnType<typeof setTimeout> | null = null;
const REALTIME_DEBOUNCE_MS = 600;

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
    cart: cache.cart,
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

  // Supabase is the single source of truth — always use remote data.
  // Except for the cart, which is local.
  // Never re-seed or restore deleted orders from localStorage.
  cache = { ...remote, cart: cache.cart };
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
        // Set up realtime subscription with debouncing to prevent race conditions.
        // Supabase Realtime fires immediately, but the DB change may not be
        // readable yet via REST. The debounce waits for propagation to complete.
        unsubscribeRealtime?.();
        unsubscribeRealtime = subscribeToSupabaseChanges(() => {
          if (realtimeDebounceTimer) clearTimeout(realtimeDebounceTimer);
          realtimeDebounceTimer = setTimeout(() => {
            realtimeDebounceTimer = null;
            void refreshStore({ silent: true });
          }, REALTIME_DEBOUNCE_MS);
        });
      } else {
        await pullFromLocal();
      }
      isReady = true;
    } catch (e) {
      const message = e instanceof Error ? e.message : "تعذّر تحميل البيانات";
      error = message;
      try {
        // Fallback to localStorage read-only — never push back to Supabase on error.
        await pullFromLocal();
        isReady = true;
      } catch {
        cache = createDefaultData();
        isReady = true;
      }
    } finally {
      isLoading = false;
      // Reset the promise so the next page load/re-mount triggers a fresh fetch.
      hydratePromise = null;
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
    // Supabase is always authoritative — no local-wins logic here.
    const remote = await fetchAppDataFromSupabase();
    cache = { ...remote, cart: cache.cart };
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
  const updated = {
    ...catalog,
    id: catalog.id || "main-product",
    updatedAt: now(),
  };

  if (isSupabaseConfigured) {
    // Write to Supabase FIRST — then update local cache to match confirmed write.
    await upsertCatalogToSupabase(updated);
  }
  cache = { ...cache, catalog: updated };
  persistLocal();
}


export async function replaceShipping(shipping: ShippingSettings): Promise<void> {
  if (isSupabaseConfigured) {
    // Write to Supabase FIRST — then update local cache to match confirmed write.
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
  email?: string;
  city?: string;
  area?: string;
  bostaDistrictId?: string;
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

  const orderId = uid();
  const order: OrderRecord = {
    id: orderId,
    orderNumber,
    ...input,
    email: input.email ?? "",
    city: input.city ?? "",
    area: input.area ?? "",
    bostaDistrictId: input.bostaDistrictId ?? null,
    unitPrice,
    shippingFee,
    subtotal,
    total,
    paymentMethod: "cash_on_delivery",
    bostaOrderSent: false,
    status: "pending",
    createdAt: t,
    updatedAt: t,
    items: [
      {
        id: uid(),
        orderId,
        bookId: cache.catalog.id,
        title: `${cache.catalog.title} ${cache.catalog.titleHighlight}`.trim(),
        skuCode: cache.catalog.skuCode,
        quantity: input.quantity,
        price: unitPrice,
      },
    ],
  };

  if (isSupabaseConfigured) {
    const saved = await insertOrderToSupabase(order);
    cache = { ...cache, orders: [saved, ...cache.orders] };
  } else {
    cache = { ...cache, orders: [order, ...cache.orders] };
  }
  persistLocal();
  const created = cache.orders[0]!;

  // Bosta auto-trigger — fires immediately after DB insert
  if (isSupabaseConfigured) {
    import("@/services/bosta").then((mod) => {
      mod.triggerCreateBostaOrder(created.id).catch((err) => {
        console.error("[Bosta] Auto-send failed:", err?.message ?? err);
      });
    });
  }

  // Send email alert in production (server-side via Vercel function).
  // Never block order creation if email sending fails.
  if (import.meta.env.PROD) {
    void fetch("/api/order-alert", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ order: created }),
    }).catch(() => {});
  }

  return created;
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


export function addToCart(productId: string, quantity: number = 1): void {
  const product = cache.catalog;
  if (!product.active) return;

  if (!cache.cart) {
    cache.cart = { items: [], updatedAt: new Date().toISOString() };
  }

  // Check if product already in cart
  const existingItemIndex = cache.cart.items.findIndex(
    (item) => item.productId === productId
  );

  let updatedItems: CartItem[];
  if (existingItemIndex >= 0) {
    // Update existing item
    updatedItems = cache.cart.items.map((item, index) =>
      index === existingItemIndex
        ? {
            ...item,
            quantity: item.quantity + quantity,
            updatedAt: new Date().toISOString(),
          }
        : item
    );
  } else {
    // Add new item
    const newItem: CartItem = {
      id: crypto.randomUUID(),
      productId: product.id,
      title: `${product.title} ${product.titleHighlight}`.trim(),
      skuCode: product.skuCode,
      quantity,
      unitPrice: product.priceAfter,
      imageUrl: product.slides[0]?.imageUrl, // First slide image
    };
    updatedItems = [...cache.cart.items, newItem];
  }

  cache = {
    ...cache,
    cart: {
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    },
  };
  persistLocal();
}

export function removeFromCart(productId: string): void {
  if (!cache.cart) return;

  cache = {
    ...cache,
    cart: {
      items: cache.cart.items.filter((item) => item.productId !== productId),
      updatedAt: new Date().toISOString(),
    },
  };
  persistLocal();
}

export function updateCartQuantity(productId: string, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  if (!cache.cart) return;

  cache = {
    ...cache,
    cart: {
      items: cache.cart.items.map((item) =>
        item.productId === productId
          ? { ...item, quantity, updatedAt: new Date().toISOString() }
          : item
      ),
      updatedAt: new Date().toISOString(),
    },
  };
  persistLocal();
}

export function clearCart(): void {
  cache = {
    ...cache,
    cart: {
      items: [],
      updatedAt: new Date().toISOString(),
    },
  };
  persistLocal();
}

export function getCartItemCount(): number {
  if (!cache.cart) return 0;
  return cache.cart.items.reduce((total, item) => total + item.quantity, 0);
}

export function getCartTotal(): number {
  if (!cache.cart) return 0;
  return cache.cart.items.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0
  );
}
