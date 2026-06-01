import { formatPrice } from "./format";
import type { ShippingSettings } from "./types";

export function resolveShippingFee(
  governorate: string,
  shipping: ShippingSettings,
): number {
  if (!governorate) return 0;
  const match = shipping.governorateFees.find((g) => g.governorate === governorate);
  return match?.fee ?? shipping.defaultFee;
}

export function formatShippingFee(fee: number): string {
  if (fee === 0) return "شحن مجاني";
  return formatPrice(fee);
}
