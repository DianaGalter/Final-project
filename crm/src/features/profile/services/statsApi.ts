import api from '@/shared/services/api';

export const statsApi = {
  getDashboard: () => api.get('/stats/dashboard').then((r) => r.data),
};
