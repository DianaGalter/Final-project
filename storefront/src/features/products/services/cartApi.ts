import api from '@/shared/services/api';

export const cartApi = {
  get: () => api.get('/cart').then((r) => r.data),
  addItem: (productId: string, quantity: number) =>
    api.post('/cart/items', { productId, quantity }).then((r) => r.data),
  updateItem: (itemId: string, quantity: number) =>
    api.put(`/cart/items/${itemId}`, { quantity }).then((r) => r.data),
  removeItem: (itemId: string) => api.delete(`/cart/items/${itemId}`).then((r) => r.data),
  clear: () => api.delete('/cart').then((r) => r.data),
  merge: (guestId: string) => api.post('/cart/merge', { guestId }).then((r) => r.data),
  sync: (items: { productId: string; quantity: number }[]) =>
    api.post('/cart/sync', { items }).then((r) => r.data),
};
