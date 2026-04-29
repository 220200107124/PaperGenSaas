import apiClient from './apiClient';

export interface SchoolRequest {
  id: string;
  schoolName: string;
  email: string;
  contactPerson?: string;
  phone: string;

  city: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export const schoolRequestsService = {
  getAll: async (): Promise<SchoolRequest[]> => {
    const response = await apiClient.get<SchoolRequest[]>('/school-requests');
    // Ensure we only show pending requests by default if needed, 
    // or filter on the frontend. The backend might return all.
    return response.data;
  },

  approve: async (id: string): Promise<void> => {
    await apiClient.post(`/school-requests/${id}/approve`);
  },

  reject: async (id: string): Promise<void> => {
    await apiClient.post(`/school-requests/${id}/reject`);
  },

  create: async (data: any): Promise<any> => {
    const response = await apiClient.post('/school-requests', data);
    return response.data;
  }
};

