export const calcCheckoutTotals = (subtotal: number) => {
  const shippingPrice = subtotal > 100 ? 0 : 10;
  const tax = Number((subtotal * 0.1).toFixed(2));
  const total = subtotal + shippingPrice + tax;
  return { shippingPrice, tax, total };
};
