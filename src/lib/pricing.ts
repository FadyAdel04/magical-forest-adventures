export function calcDiscountPercent(priceBefore: number, priceAfter: number): number {
  if (priceBefore <= 0 || priceAfter >= priceBefore) return 0;
  return Math.round(((priceBefore - priceAfter) / priceBefore) * 100);
}

export function calcSavings(priceBefore: number, priceAfter: number): number {
  return Math.max(0, priceBefore - priceAfter);
}

export function orderLineTotal(unitPrice: number, quantity: number, shippingFee: number) {
  const subtotal = unitPrice * quantity;
  return { subtotal, shippingFee, total: subtotal + shippingFee };
}
