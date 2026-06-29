import { GOVERNORATES } from "@/lib/governorates";
import { validateEgyptPhone } from "@/lib/phone-validation";

export type OrderFormValues = {
  name: string;
  phone: string;
  email: string;
  gov: string;
  city?: string;
  area: string;
  address: string;
  notes: string;
};

export type OrderFormField = keyof OrderFormValues;

export type OrderFormErrors = Partial<Record<OrderFormField, string>>;

const NAME_RE = /^[\u0600-\u06FFa-zA-Z\s.'-]{2,80}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CITY_RE = /^[\u0600-\u06FFa-zA-Z0-9\s.'-]{2,80}$/;

export function validateOrderForm(
  form: OrderFormValues,
): { errors: OrderFormErrors; normalizedPhone?: string } {
  const errors: OrderFormErrors = {};

  const name = form.name.trim();
  if (!name) {
    errors.name = "الاسم مطلوب";
  } else if (name.length < 2) {
    errors.name = "يجب أن يكون حرفين على الأقل";
  } else if (!NAME_RE.test(name)) {
    errors.name = "الاسم يحتوي على رموز غير مسموحة";
  }

  const email = form.email?.trim();
  if (email && !EMAIL_RE.test(email)) {
    errors.email = "البريد الإلكتروني غير صالح";
  }

  const phoneCheck = validateEgyptPhone(form.phone);
  if (!phoneCheck.valid) {
    errors.phone = phoneCheck.error;
  }

  if (!form.gov.trim()) {
    errors.gov = "اختر المحافظة";
  } else if (!(GOVERNORATES as readonly string[]).includes(form.gov)) {
    errors.gov = "المحافظة غير صالحة";
  }

  const city = form.city?.trim() || "";
  if (city) {
    if (city.length < 2) {
      errors.city = "يجب أن تكون المدينة حرفين على الأقل";
    } else if (!CITY_RE.test(city)) {
      errors.city = "المدينة تحتوي على رموز غير مسموحة";
    }
  }

  const area = form.area.trim();
  if (!area) {
    errors.area = "الحي / المنطقة مطلوب";
  } else if (area.length < 2) {
    errors.area = "يجب أن تكون حرفين على الأقل";
  } else if (!CITY_RE.test(area)) {
    errors.area = "الحي تحتوي على رموز غير مسموحة";
  }

  const address = form.address.trim();
  if (!address) {
    errors.address = "العنوان التفصيلي مطلوب";
  } else if (address.length < 5) {
    errors.address = "العنوان قصير جدًا — أضف تفاصيل أكثر (5 أحرف على الأقل)";
  }

  if (form.notes.trim().length > 500) {
    errors.notes = "الملاحظات طويلة جدًا (500 حرف كحد أقصى)";
  }

  return {
    errors,
    normalizedPhone: phoneCheck.valid ? phoneCheck.normalized : undefined,
  };
}
