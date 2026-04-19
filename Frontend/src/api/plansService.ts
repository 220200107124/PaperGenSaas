import apiClient from './apiClient';

export interface Plan {
  id: string;
  name: string;
  type?: string;
  price: number;
  description: string;
  paperLimit: number;
  teacherLimit: number;
  modulePermissions: {
    paperModule?: boolean;
    teacherModule?: boolean;
    questionModule?: boolean;
    aiModule?: boolean;
  };
}

export const plansService = {
  getPlans: async (): Promise<Plan[]> => {
    const response = await apiClient.get<{ data: Plan[] }>('/plans');
    return response.data.data;
  }
};
