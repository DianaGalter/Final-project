import api from '@/shared/services/api';
import type { User } from '../slices/authSlice';

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<User>('/auth/register', data).then((r) => r.data),
  login: (data: { email: string; password: string }) =>
    api
      .post<User & { requires2FA?: boolean; userId?: string }>('/auth/login', data)
      .then((r) => r.data),
  verify2FA: (data: { userId: string; code: string }) =>
    api.post<User>('/auth/verify-2fa', data).then((r) => r.data),
  me: () => api.get<User>('/auth/me').then((r) => r.data),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post<User>('/auth/reset-password', { token, password }).then((r) => r.data),
  updateProfile: (data: Partial<User>) => api.put('/users/profile', data).then((r) => r.data),
};
