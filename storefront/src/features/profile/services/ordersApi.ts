import api from '@/shared/services/api';

export const ordersApi = {
  create: (payload: {
    orderItems: unknown[];
    shippingAddress: Record<string, string>;
    paymentMethod: string;
  }) => api.post('/orders', payload).then((r) => r.data),
  getMyOrders: () => api.get('/orders/my').then((r) => r.data),
};
