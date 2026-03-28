import apiClient from './apiClient';
import type { Question } from '../types';

export const questionService = {
  getQuestions: async (params?: any): Promise<{ success: boolean; data: Question[]; pagination: any; message?: string }> => {
    const response = await apiClient.get<{ success: boolean; data: Question[]; pagination: any; message?: string }>('/questions', { params });
    return response.data;
  },

  getQuestionById: async (id: string): Promise<Question> => {
    const response = await apiClient.get<{ data: Question }>(`/questions/${id}`);
    return response.data.data;
  },

  createQuestion: async (questionData: Partial<Question>): Promise<Question> => {
    const response = await apiClient.post<{ data: Question }>('/questions', questionData);
    return response.data.data;
  },

  updateQuestion: async (id: string, questionData: Partial<Question>): Promise<Question> => {
    const response = await apiClient.patch<{ data: Question }>(`/questions/${id}`, questionData);
    return response.data.data;
  },

  deleteQuestion: async (id: string): Promise<void> => {
    await apiClient.delete(`/questions/${id}`);
  },
};
