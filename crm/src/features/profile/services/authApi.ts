import api from '@/shared/services/api';

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api
      .post<{ requires2FA?: boolean; userId?: string; role?: string; token?: string }>(
        '/auth/login',
        data
      )
      .then((r) => r.data),
  verify2FA: (data: { userId: string; code: string }) =>
    api.post('/auth/verify-2fa', data).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};
