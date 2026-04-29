import apiClient from './apiClient';
import type { School } from '../types';

export const schoolService = {
  getSchools: async (): Promise<School[]> => {
    const response = await apiClient.get<School[]>('/schools');
    return response.data;
  },

  getSchoolById: async (id: string): Promise<School> => {
    const response = await apiClient.get<School>(`/schools/${id}`);
    return response.data;
  },

  createSchool: async (schoolData: Partial<School>): Promise<School> => {
    const response = await apiClient.post<School>('/schools', schoolData);
    return response.data;
  },

  updateSchool: async (id: string, schoolData: Partial<School>): Promise<School> => {
    const response = await apiClient.patch<School>(`/schools/${id}`, schoolData);
    return response.data;
  },

  deleteSchool: async (id: string): Promise<void> => {
    await apiClient.delete(`/schools/${id}`);
  },
};
