import api from '../lib/axios';

export interface PlatformStats {
  totalSchools: number;
  totalUsers: number;
  globalQuestions: number;
  totalPapersGenerated: number;
  activeSubscriptions: number;
  recentSchools: {
    id: string;
    name: string;
    city: string;
    plan: string;
    status: 'Active' | 'Inactive';
    createdAt: string;
  }[];
}

export const superAdminService = {
  getStats: async () => {
    const response = await api.get<{ data: PlatformStats }>('/super-admin/stats');
    return response.data.data;
  },
};
