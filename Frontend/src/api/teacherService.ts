import apiClient from './apiClient';
import type { User } from '../types';

export const teacherService = {
  getAll: async (params?: any): Promise<{ data: User[]; pagination: any; success: boolean }> => {
    const response = await apiClient.get<any>('/teachers', { params });
    return response.data;
  },

  create: async (data: any): Promise<User> => {
    const response = await apiClient.post<User>('/teachers', data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/teachers/${id}`);
  }
};
