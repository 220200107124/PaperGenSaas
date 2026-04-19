import apiClient, { publicApiClient } from './apiClient';

export interface Standard {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  standardId: string;
}

export interface Chapter {
  id: string;
  name: string;
  subjectId: string;
}

export const masterDataService = {
  getStandards: async (): Promise<Standard[]> => {
    const response = await publicApiClient.get<{ data: Standard[] }>('/standards/public');
    return response.data.data;
  },

  createStandard: async (name: string): Promise<Standard> => {
    const response = await apiClient.post<{ data: Standard }>('/standards', { name });
    return response.data.data;
  },

  getSubjects: async (standardId?: string): Promise<Subject[]> => {
    const response = await publicApiClient.get<{ data: Subject[] }>('/subjects/public', {
      params: { standardId },
    });
    return response.data.data;
  },

  createSubject: async (name: string, standardId: string): Promise<Subject> => {
    const response = await apiClient.post<{ data: Subject }>('/subjects', { name, standardId });
    return response.data.data;
  },

  getChapters: async (subjectId?: string): Promise<Chapter[]> => {
    const response = await publicApiClient.get<{ data: Chapter[] }>('/chapters', {
      params: { subjectId },
    });
    return response.data.data;
  },

  createChapter: async (name: string, subjectId: string): Promise<Chapter> => {
    const response = await apiClient.post<{ data: Chapter }>('/chapters', { name, subjectId });
    return response.data.data;
  },
};
