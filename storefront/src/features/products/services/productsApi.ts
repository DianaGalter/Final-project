import api from '@/shared/services/api';
import type { Product } from '../slices/productsSlice';

export const productsApi = {
  getAll: (params?: { featured?: boolean; category?: string; search?: string }) =>
    api.get<Product[]>('/products', { params }).then((r) => r.data),
  getById: (id: string) => api.get<Product>(`/products/${id}`).then((r) => r.data),
};
