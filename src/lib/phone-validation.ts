/** Normalize user input to Egyptian local mobile format (11 digits, leading 0). */
export function normalizeEgyptPhone(input: string): string {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("20") && digits.length >= 12) {
    digits = `0${digits.slice(2)}`;
  } else if (digits.length === 10 && digits.startsWith("1")) {
    digits = `0${digits}`;
  }
  return digits.slice(0, 11);
}

const EGYPT_MOBILE_RE = /^01[0125]\d{8}$/;

export function validateEgyptPhone(input: string): {
  valid: boolean;
  normalized: string;
  error?: string;
} {
  const normalized = normalizeEgyptPhone(input);

  if (!normalized) {
    return { valid: false, normalized, error: "رقم الهاتف مطلوب" };
  }
  if (normalized.length < 11) {
    return {
      valid: false,
      normalized,
      error: "رقم الهاتف غير مكتمل (11 رقمًا مثل 01012345678)",
    };
  }
  if (!EGYPT_MOBILE_RE.test(normalized)) {
    return {
      valid: false,
      normalized,
      error: "أدخل رقم موبايل مصري صحيح (يبدأ بـ 010 أو 011 أو 012 أو 015)",
    };
  }
  return { valid: true, normalized };
}

export function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.startsWith("20")) {
    return normalizeEgyptPhone(digits);
  }
  return digits;
}
