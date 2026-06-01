import { GOVERNORATES } from "@/lib/governorates";
import { validateEgyptPhone } from "@/lib/phone-validation";

export type OrderFormValues = {
  name: string;
  phone: string;
  gov: string;
  address: string;
  notes: string;
};

export type OrderFormField = keyof OrderFormValues;

export type OrderFormErrors = Partial<Record<OrderFormField, string>>;

const NAME_RE = /^[\u0600-\u06FFa-zA-Z\s.'-]{2,80}$/;

export function validateOrderForm(
  form: OrderFormValues,
): { errors: OrderFormErrors; normalizedPhone?: string } {
  const errors: OrderFormErrors = {};
  const name = form.name.trim();

  if (!name) {
    errors.name = "الاسم بالكامل مطلوب";
  } else if (name.length < 2) {
    errors.name = "الاسم يجب أن يكون حرفين على الأقل";
  } else if (!NAME_RE.test(name)) {
    errors.name = "الاسم يحتوي على رموز غير مسموحة";
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

  const address = form.address.trim();
  if (!address) {
    errors.address = "العنوان مطلوب";
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
