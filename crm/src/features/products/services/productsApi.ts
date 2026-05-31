import api from '@/shared/services/api';

export const productsApi = {
  getAll: () => api.get('/products').then((r) => r.data),
  create: (data: Record<string, unknown>) => api.post('/products', data).then((r) => r.data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/products/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/products/${id}`),
};
