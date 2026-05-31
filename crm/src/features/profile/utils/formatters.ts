export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export const formatOrderId = (id: string) => `#${id.slice(-6).toUpperCase()}`;
