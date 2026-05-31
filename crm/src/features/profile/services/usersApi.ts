import api from '@/shared/services/api';

export const usersApi = {
  getAll: () => api.get('/users').then((r) => r.data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/users/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/users/${id}`),
};
