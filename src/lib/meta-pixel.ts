/**
 * Meta Pixel (Facebook Pixel) Helper Utility
 * Standard events: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase, Lead, Contact
 */

export interface MetaPixelContentItem {
  id: string;
  name?: string;
  quantity?: number;
  item_price?: number;
}

export interface MetaPixelViewContentParams {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
}

export interface MetaPixelAddToCartParams {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
  num_items?: number;
}

export interface MetaPixelInitiateCheckoutParams {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
  num_items?: number;
}

export interface MetaPixelPurchaseParams {
  value: number;
  currency?: string;
  content_name?: string;
  content_ids?: string[];
  content_type?: string;
  num_items?: number;
  order_id?: string;
}

export interface MetaPixelContactParams {
  content_name?: string;
  method?: string;
  value?: number;
  currency?: string;
}

import type { ProductCatalog } from "./types";

const DEFAULT_CURRENCY = "EGP";

/**
 * Helper to build standard Meta Pixel product params dynamically from ProductCatalog
 */
export function getPixelProductParams(
  catalog?: ProductCatalog | null,
  quantity = 1,
  customValue?: number,
) {
  if (!catalog) return undefined;

  const rawTitle = `${catalog.title ?? ""} ${catalog.titleHighlight ?? ""}`.trim();
  const contentName = rawTitle || "صندوق نسيج التعليمي";
  const category = catalog.badge || "Interactive Educational Box";
  const id = catalog.skuCode || catalog.id || "main-product";
  const currencyCode = catalog.currency === "جنيه" ? "EGP" : catalog.currency || DEFAULT_CURRENCY;
  const unitPrice = Number(catalog.priceAfter) || 0;
  const totalValue = customValue ?? unitPrice * quantity;

  return {
    content_name: contentName,
    content_category: category,
    content_ids: [id],
    content_type: "product",
    value: totalValue,
    currency: currencyCode,
    num_items: quantity,
  };
}

/**
 * Low-level call to window.fbq with safety checks and development logging
 */
function fbqTrack(eventName: string, params?: Record<string, unknown>, trackType: "track" | "trackCustom" = "track") {
  if (typeof window === "undefined") return;

  if (import.meta.env.DEV) {
    console.log(`[Meta Pixel ${trackType}]`, eventName, params ?? {});
  }

  if (typeof window.fbq === "function") {
    try {
      if (params) {
        window.fbq(trackType, eventName, params);
      } else {
        window.fbq(trackType, eventName);
      }
    } catch (error) {
      console.error("[Meta Pixel Error]", error);
    }
  } else {
    if (import.meta.env.DEV) {
      console.warn("[Meta Pixel] window.fbq is not loaded yet.");
    }
  }
}

/**
 * Track generic PageView event
 */
export function trackPageView() {
  fbqTrack("PageView");
}

/**
 * Track ViewContent event (e.g. when landing page or product detail is viewed)
 */
export function trackViewContent(params?: MetaPixelViewContentParams) {
  if (!params) return;
  fbqTrack("ViewContent", {
    content_name: params.content_name,
    content_category: params.content_category,
    content_ids: params.content_ids,
    content_type: params.content_type ?? "product",
    value: params.value,
    currency: params.currency ?? DEFAULT_CURRENCY,
  });
}

/**
 * Track AddToCart event (e.g. when CTA 'إطلب الآن' is clicked)
 */
export function trackAddToCart(params?: MetaPixelAddToCartParams) {
  if (!params) return;
  fbqTrack("AddToCart", {
    content_name: params.content_name,
    content_category: params.content_category,
    content_ids: params.content_ids,
    content_type: params.content_type ?? "product",
    value: params.value,
    currency: params.currency ?? DEFAULT_CURRENCY,
    num_items: params.num_items ?? 1,
  });
}

/**
 * Track InitiateCheckout event (e.g. when order form is opened or interacted with)
 */
export function trackInitiateCheckout(params?: MetaPixelInitiateCheckoutParams) {
  if (!params) return;
  fbqTrack("InitiateCheckout", {
    content_name: params.content_name,
    content_category: params.content_category,
    content_ids: params.content_ids,
    value: params.value,
    currency: params.currency ?? DEFAULT_CURRENCY,
    num_items: params.num_items ?? 1,
  });
}

/**
 * Track Purchase event (e.g. when order form is submitted successfully)
 */
export function trackPurchase(params: MetaPixelPurchaseParams) {
  fbqTrack("Purchase", {
    value: params.value,
    currency: params.currency ?? DEFAULT_CURRENCY,
    content_name: params.content_name,
    content_ids: params.content_ids,
    content_type: params.content_type ?? "product",
    num_items: params.num_items ?? 1,
    order_id: params.order_id,
  });
}

/**
 * Track Lead event
 */
export function trackLead(params?: { content_name?: string; value?: number; currency?: string }) {
  fbqTrack("Lead", {
    content_name: params?.content_name ?? "طلب مغامرات نسيج",
    value: params?.value,
    currency: params?.currency ?? DEFAULT_CURRENCY,
  });
}

/**
 * Track Contact event (e.g. WhatsApp button click)
 */
export function trackContact(params?: MetaPixelContactParams) {
  fbqTrack("Contact", {
    content_name: params?.content_name ?? "تواصل عبر واتساب",
    method: params?.method ?? "WhatsApp",
    value: params?.value,
    currency: params?.currency ?? DEFAULT_CURRENCY,
  });
}

/**
 * Track any custom event
 */
export function trackCustomEvent(eventName: string, params?: Record<string, unknown>) {
  fbqTrack(eventName, params, "trackCustom");
}
