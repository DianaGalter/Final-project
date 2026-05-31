import api from '@/shared/services/api';

export const ordersApi = {
  getAll: () => api.get('/orders').then((r) => r.data),
  updateStatus: (id: string, status: string) =>
    api.put(`/orders/${id}/status`, { status }).then((r) => r.data),
};
