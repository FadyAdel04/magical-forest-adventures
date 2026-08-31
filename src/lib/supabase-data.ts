import { getSupabase } from "./supabase";
import {
  catalogToProductRow,
  orderRecordToRow,
  orderRowToRecord,
  productRowToCatalog,
  settingsToShippingRow,
  shippingRowToSettings,
} from "./supabase-mappers";
import type { AppData, OrderRecord, OrderStatus, ProductCatalog, ShippingSettings } from "./types";
import { createDefaultCatalog, createDefaultShipping } from "./store-defaults";

const PRODUCT_ID = "main-product";
const SHIPPING_ID = "default";

export async function fetchAppDataFromSupabase(): Promise<AppData> {
  const supabase = getSupabase();

  const [productRes, shippingRes, ordersRes] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("shipping_settings").select("*").eq("id", SHIPPING_ID).maybeSingle(),
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
  ]);

  if (productRes.error) throw productRes.error;
  if (shippingRes.error) throw shippingRes.error;
  if (ordersRes.error) throw ordersRes.error;

  // Use in-memory defaults ONLY — never auto-seed defaults to Supabase.
  // Auto-seeding caused real data to be overwritten when Supabase returned
  // a transient empty result (network glitch, cold start, etc.).
  const catalog = productRes.data ? productRowToCatalog(productRes.data) : createDefaultCatalog();
  const shipping = shippingRes.data
    ? shippingRowToSettings(shippingRes.data)
    : createDefaultShipping();

  const orders = (ordersRes.data ?? []).map(orderRowToRecord);

  return { catalog, orders, shipping };
}

export async function upsertCatalogToSupabase(catalog: ProductCatalog): Promise<void> {
  const supabase = getSupabase();
  const normalizedCatalog = {
    ...catalog,
    id: catalog.id || PRODUCT_ID,
  };
  const row = catalogToProductRow(normalizedCatalog);
  const { error } = await supabase.from("products").upsert(row, { onConflict: "id" });
  if (error) throw error;
}

export async function upsertShippingToSupabase(shipping: ShippingSettings): Promise<void> {
  const supabase = getSupabase();
  const row = settingsToShippingRow(shipping);
  const { error } = await supabase.from("shipping_settings").upsert(row, { onConflict: "id" });
  if (error) throw error;
}

export async function insertOrderToSupabase(order: OrderRecord): Promise<OrderRecord> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("orders")
    .insert(orderRecordToRow(order))
    .select()
    .single();
  if (error) throw error;

  if (order.items && order.items.length > 0) {
    const itemsRows = order.items.map((item) => ({
      id: item.id,
      order_id: item.orderId,
      book_id: item.bookId,
      title: item.title,
      sku_code: item.skuCode,
      quantity: item.quantity,
      price: item.price,
    }));
    const { error: itemsError } = await supabase.from("order_items").insert(itemsRows);
    if (itemsError) throw itemsError;
  }

  const saved = orderRowToRecord(data);
  saved.items = order.items;
  return saved;
}

export async function updateOrderStatusInSupabase(
  id: string,
  status: OrderStatus,
  updatedAt: string,
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: updatedAt })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteOrderFromSupabase(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw error;
}

export async function nextOrderNumberFromSupabase(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `NSG-${year}-`;
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from("orders")
    .select("order_number")
    .like("order_number", `${prefix}%`)
    .order("order_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  
  if (data?.order_number) {
    const lastSeq = parseInt(data.order_number.replace(prefix, ""), 10);
    const seq = (isNaN(lastSeq) ? 0 : lastSeq) + 1;
    return `${prefix}${String(seq).padStart(4, "0")}`;
  }
  
  return `${prefix}0001`;
}

export async function seedAppDataToSupabase(data: AppData): Promise<void> {
  const supabase = getSupabase();
  const { data: existingCatalog } = await supabase
    .from("products")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (!existingCatalog) {
    await upsertCatalogToSupabase(data.catalog);
  }

  const { data: existingShipping } = await supabase
    .from("shipping_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (!existingShipping) {
    await upsertShippingToSupabase(data.shipping);
  }

  for (const order of [...data.orders].reverse()) {
    await insertOrderToSupabase(order);
  }
}

export function subscribeToSupabaseChanges(onChange: () => void): () => void {
  const supabase = getSupabase();
  const channel = supabase
    .channel("naseeg-app")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "products" },
      () => onChange(),
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "shipping_settings" },
      () => onChange(),
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "orders" },
      () => onChange(),
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
