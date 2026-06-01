/** Order confirmation — https://wa.me/201055745507 */
export const WHATSAPP_E164 = "201055745507";
export const WHATSAPP_NUMBER_DISPLAY = "01055745507";
export const WHATSAPP_PROFILE_URL = `https://wa.me/${WHATSAPP_E164}`;

export function toWhatsAppE164(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("20")) return digits;
  if (digits.startsWith("0")) return `20${digits.slice(1)}`;
  return digits;
}

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/Naseeg.Stories",
  instagram: "https://www.instagram.com/naseeg.stories",
  tiktok: "https://www.tiktok.com/@naseeg.stories",
} as const;

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(message)}`;
}

export function buildOrderWhatsAppMessage(params: {
  orderNumber: string;
  quantity: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  name: string;
  phone: string;
  governorate: string;
  address: string;
  notes: string;
  currency?: string;
}): string {
  const currency = params.currency ?? "جنيه";
  const lines = [
    "مرحباً نسيج! 🌿",
    "طلب جديد — مغامرات نسيج في الغابة السحرية",
    "",
    `رقم الطلب: ${params.orderNumber}`,
    `الكمية: ${params.quantity}`,
    `المجموع: ${params.subtotal} ${currency}`,
    `الشحن: ${params.shippingFee} ${currency}`,
    `الإجمالي: ${params.total} ${currency}`,
    "",
    `الاسم: ${params.name}`,
    `الهاتف: ${params.phone}`,
    `المحافظة: ${params.governorate}`,
    `العنوان: ${params.address}`,
  ];
  if (params.notes.trim()) {
    lines.push(`ملاحظات: ${params.notes.trim()}`);
  }
  return lines.join("\n");
}
