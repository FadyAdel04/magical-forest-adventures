export type ProductSlide = {
  id: string;
  imageUrl: string;
  title: string;
  caption: string;
};

export type ProductFeature = {
  id: string;
  text: string;
};

export type ProductCatalog = {
  id: string;
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  priceBefore: number;
  priceAfter: number;
  offerEnabled: boolean;
  currency: string;
  features: ProductFeature[];
  slides: ProductSlide[];
  active: boolean;
  updatedAt: string;
};

export type GovernorateShippingFee = {
  governorate: string;
  fee: number;
};

export type ShippingSettings = {
  defaultFee: number;
  governorateFees: GovernorateShippingFee[];
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderRecord = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  governorate: string;
  address: string;
  notes: string;
  quantity: number;
  unitPrice: number;
  shippingFee: number;
  subtotal: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

export type AppData = {
  catalog: ProductCatalog;
  orders: OrderRecord[];
  shipping: ShippingSettings;
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  processing: "قيد التجهيز",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};
