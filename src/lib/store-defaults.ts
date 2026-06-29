import { GOVERNORATES } from "./governorates";
import { resolveLegacyImage, type ImageAssetKey } from "./imageAssets";
import type { AppData, OrderRecord, ProductCatalog, ShippingSettings } from "./types";

function uid() {
  return crypto.randomUUID();
}

function now() {
  return new Date().toISOString();
}

export function createDefaultShipping(): ShippingSettings {
  return {
    defaultFee: 0,
    governorateFees: GOVERNORATES.map((governorate) => ({ governorate, fee: 0 })),
  };
}

export function createDefaultCatalog(): ProductCatalog {
  const t = now();
  return {
    id: "main-product",
    badge: "منتجاتنا",
    title: "مغامرات الحروف في",
    titleHighlight: "الغابة السحرية",
    description:
      "صندوق تعليمي تفاعلي يجمع القصص والأصوات والشموع العطرية والبازل — تجربة حسّية كاملة تبني ذاكرة طفلك من خلال اللعب والاستكشاف.",
    priceBefore: 899,
    priceAfter: 699,
    offerEnabled: true,
    currency: "جنيه",
    features: [
      { id: uid(), text: "17 قصة تفاعلية تنمي الخيال وحب التعلم" },
      { id: uid(), text: "17 رمز QR صوتي مع شخصيات الغابة" },
      { id: uid(), text: "2 شمعة غابة عطرية لأجواء القصة" },
      { id: uid(), text: "4 مجموعات بازل لإعادة بناء المشاهد" },
    ],
    slides: [
      {
        id: uid(),
        imageUrl: resolveLegacyImage("product"),
        title: "صندوق الغابة السحرية",
        caption: "كل المغامرة في صندوق واحد",
      },
      {
        id: uid(),
        imageUrl: resolveLegacyImage("product3"),
        title: "محتويات الغابة",
        caption: "قصص وأدوات تفاعلية",
      },
      {
        id: uid(),
        imageUrl: resolveLegacyImage("product2"),
        title: "ملصقات اليقطين",
        caption: "زخارف ومرح لطفلك",
      },
      {
        id: uid(),
        imageUrl: resolveLegacyImage("product4"),
        title: "شموع الغابة",
        caption: "عطر يفتح أبواب الخيال",
      },
    ],
    skuCode: "main-product-sku",
    active: true,
    updatedAt: t,
  };
}

export function createDefaultData(): AppData {
  return {
    catalog: createDefaultCatalog(),
    orders: [],
    shipping: createDefaultShipping(),
  };
}

const STORAGE_KEY = "naseeg_admin_data_v2";
const LEGACY_KEY = "naseeg_admin_data_v1";

function migrateLegacySlide(slide: Record<string, unknown>) {
  const key = (slide.imageKey as ImageAssetKey) ?? "product";
  return {
    id: (slide.id as string) ?? uid(),
    imageUrl: (slide.imageUrl as string) ?? resolveLegacyImage(key),
    title: (slide.title as string) ?? "",
    caption: (slide.caption as string) ?? "",
  };
}

function migrateLegacyCatalog(raw: Record<string, unknown>): ProductCatalog {
  const priceAfter = Number(raw.priceAfter ?? raw.price ?? 699);
  const priceBefore = Number(raw.priceBefore ?? Math.round(priceAfter * 1.15));
  return {
    id: (raw.id as string) ?? "main-product",
    badge: (raw.badge as string) ?? "منتجاتنا",
    title: (raw.title as string) ?? "",
    titleHighlight: (raw.titleHighlight as string) ?? "",
    description: (raw.description as string) ?? "",
    priceBefore,
    priceAfter,
    offerEnabled: Boolean(raw.offerEnabled ?? priceBefore > priceAfter),
    currency: (raw.currency as string) ?? "جنيه",
    features: Array.isArray(raw.features) ? (raw.features as ProductCatalog["features"]) : [],
    slides: Array.isArray(raw.slides)
      ? (raw.slides as Record<string, unknown>[]).map(migrateLegacySlide)
      : [],
    skuCode: (raw.skuCode as string) ?? "main-product-sku",
    active: raw.active !== false,
    updatedAt: (raw.updatedAt as string) ?? now(),
  };
}

function migrateLegacyOrder(o: Record<string, unknown>): OrderRecord {
  const quantity = Number(o.quantity ?? 1);
  const unitPrice = Number(o.unitPrice ?? 699);
  const subtotal = Number(o.subtotal ?? unitPrice * quantity);
  const shippingFee = Number(o.shippingFee ?? 0);
  const total = Number(o.total ?? subtotal + shippingFee);
  return {
    id: o.id as string,
    orderNumber: o.orderNumber as string,
    customerName: o.customerName as string,
    phone: o.phone as string,
    governorate: o.governorate as string,
    address: o.address as string,
    notes: (o.notes as string) ?? "",
    quantity,
    unitPrice,
    shippingFee,
    subtotal,
    total,
    email: (o.email as string) ?? "",
    city: (o.city as string) ?? "",
    area: (o.area as string) ?? "",
    paymentMethod: (o.paymentMethod as string) ?? "cash_on_delivery",
    flextockStatus: (o.flextockStatus as string | null) ?? null,
    trackingNumber: (o.trackingNumber as string | null) ?? null,
    trackingUrl: (o.trackingUrl as string | null) ?? null,
    flextockOrderSent: Boolean(o.flextockOrderSent),
    status: o.status as OrderRecord["status"],
    createdAt: o.createdAt as string,
    updatedAt: o.updatedAt as string,
  };
}

function normalizeData(parsed: Record<string, unknown>): AppData {
  const catalog = migrateLegacyCatalog((parsed.catalog as Record<string, unknown>) ?? {});
  const orders = Array.isArray(parsed.orders)
    ? (parsed.orders as Record<string, unknown>[]).map(migrateLegacyOrder)
    : [];
  let shipping = parsed.shipping as ShippingSettings | undefined;
  if (!shipping?.governorateFees?.length) {
    shipping = createDefaultShipping();
    if (parsed.shipping && typeof parsed.shipping === "object") {
      const s = parsed.shipping as ShippingSettings;
      shipping.defaultFee = s.defaultFee ?? 0;
    }
  }
  return { catalog, orders, shipping };
}

/** Read legacy localStorage backup (used for one-time migration to Supabase). */
export function loadLocalStorageData(): AppData | null {
  try {
    const rawV2 = localStorage.getItem(STORAGE_KEY);
    if (rawV2) {
      return normalizeData(JSON.parse(rawV2) as Record<string, unknown>);
    }
    const rawV1 = localStorage.getItem(LEGACY_KEY);
    if (rawV1) {
      return normalizeData(JSON.parse(rawV1) as Record<string, unknown>);
    }
    return null;
  } catch {
    return null;
  }
}

export function saveLocalStorageBackup(data: AppData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* quota exceeded — ignore */
  }
}
