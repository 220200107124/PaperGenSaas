import api from '../lib/axios';

export interface PlatformStats {
  totalSchools: number;
  totalUsers: number;
  globalQuestions: number;
  totalPapersGenerated: number;
  activeSubscriptions: number;
  revenue: number;
}

export const superAdminService = {
  getStats: async () => {
    const response = await api.get<{ data: PlatformStats }>('/super-admin/stats');
    return response.data.data;
  },
};
