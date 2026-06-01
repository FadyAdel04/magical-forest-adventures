/** Western (English) digits for prices and counts — Arabic UI stays RTL. */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat("en-US", options).format(value);
}

export function formatPrice(value: number, currency = "جنيه"): string {
  return `${formatNumber(value)} ${currency}`;
}
