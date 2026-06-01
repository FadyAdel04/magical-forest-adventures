import type { Database } from "./database.types";
import type {
  OrderRecord,
  OrderStatus,
  ProductCatalog,
  ShippingSettings,
} from "./types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type ShippingRow = Database["public"]["Tables"]["shipping_settings"]["Row"];
type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

export function productRowToCatalog(row: ProductRow): ProductCatalog {
  return {
    id: row.id,
    badge: row.badge,
    title: row.title,
    titleHighlight: row.title_highlight,
    description: row.description,
    priceBefore: Number(row.price_before),
    priceAfter: Number(row.price_after),
    offerEnabled: row.offer_enabled,
    currency: row.currency,
    features: row.features ?? [],
    slides: row.slides ?? [],
    active: row.active,
    updatedAt: row.updated_at,
  };
}

export function catalogToProductRow(catalog: ProductCatalog): Database["public"]["Tables"]["products"]["Insert"] {
  return {
    id: catalog.id,
    badge: catalog.badge,
    title: catalog.title,
    title_highlight: catalog.titleHighlight,
    description: catalog.description,
    price_before: catalog.priceBefore,
    price_after: catalog.priceAfter,
    offer_enabled: catalog.offerEnabled,
    currency: catalog.currency,
    features: catalog.features,
    slides: catalog.slides,
    active: catalog.active,
    updated_at: catalog.updatedAt,
  };
}

export function shippingRowToSettings(row: ShippingRow): ShippingSettings {
  return {
    defaultFee: Number(row.default_fee),
    governorateFees: row.governorate_fees ?? [],
  };
}

export function settingsToShippingRow(
  settings: ShippingSettings,
): Database["public"]["Tables"]["shipping_settings"]["Insert"] {
  return {
    id: "default",
    default_fee: settings.defaultFee,
    governorate_fees: settings.governorateFees,
  };
}

export function orderRowToRecord(row: OrderRow): OrderRecord {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    phone: row.phone,
    governorate: row.governorate,
    address: row.address,
    notes: row.notes ?? "",
    quantity: row.quantity,
    unitPrice: Number(row.unit_price),
    shippingFee: Number(row.shipping_fee),
    subtotal: Number(row.subtotal),
    total: Number(row.total),
    status: row.status as OrderStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function orderRecordToRow(
  order: OrderRecord,
): Database["public"]["Tables"]["orders"]["Insert"] {
  return {
    id: order.id,
    order_number: order.orderNumber,
    customer_name: order.customerName,
    phone: order.phone,
    governorate: order.governorate,
    address: order.address,
    notes: order.notes,
    quantity: order.quantity,
    unit_price: order.unitPrice,
    shipping_fee: order.shippingFee,
    subtotal: order.subtotal,
    total: order.total,
    status: order.status,
    created_at: order.createdAt,
    updated_at: order.updatedAt,
  };
}
