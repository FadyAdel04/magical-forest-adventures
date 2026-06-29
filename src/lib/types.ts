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
  skuCode: string;
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
  | "cancelled"
  | "shipping_error";

export type OrderItemRecord = {
  id: string;
  orderId: string;
  bookId: string;
  title: string;
  skuCode: string;
  quantity: number;
  price: number;
};

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
  email: string;
  city: string;
  area: string;
  bostaDistrictId?: string | null;
  paymentMethod: string;
  bostaStatus?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  bostaOrderSent: boolean;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items?: OrderItemRecord[];
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
  shipping_error: "خطأ في الشحن",
};
