import apiClient from './apiClient';

export interface Standard {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  standardId: string;
  standard?: Standard;
}

export interface Chapter {
  id: string;
  name: string;
  subjectId: string;
}

export const masterDataService = {
  getStandards: async (): Promise<Standard[]> => {
    const response = await apiClient.get<any>('/standards/public', {
      params: { limit: 100 }
    });
    const resData = response.data;
    return Array.isArray(resData) ? resData : (Array.isArray(resData?.data) ? resData.data : []);
  },

  createStandard: async (name: string): Promise<Standard> => {
    const response = await apiClient.post<any>('/standards', { name });
    return response.data?.data || response.data;
  },

  getSubjects: async (standardId?: string): Promise<Subject[]> => {
    const response = await apiClient.get<any>('/subjects/public', {
      params: { standardId, limit: 100 },
    });
    const resData = response.data;
    return Array.isArray(resData) ? resData : (Array.isArray(resData?.data) ? resData.data : []);
  },

  createSubject: async (name: string, standardId: string): Promise<Subject> => {
    const response = await apiClient.post<any>('/subjects', { name, standardId });
    return response.data?.data || response.data;
  },

  getChapters: async (subjectId?: string): Promise<Chapter[]> => {
    const response = await apiClient.get<any>('/chapters', {
      params: { subjectId },
    });
    const resData = response.data;
    return Array.isArray(resData) ? resData : (Array.isArray(resData?.data) ? resData.data : []);
  },

  createChapter: async (name: string, subjectId: string): Promise<Chapter> => {
    const response = await apiClient.post<any>('/chapters', { name, subjectId });
    return response.data?.data || response.data;
  },
};