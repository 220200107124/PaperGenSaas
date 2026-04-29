import apiClient from './apiClient';
import type { User } from '../types';

export interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  register: async (data: any): Promise<any> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  }
};

