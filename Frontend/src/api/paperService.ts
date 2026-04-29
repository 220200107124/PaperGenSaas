import apiClient from './apiClient';

export const paperService = {
  getPapers: async (params?: any): Promise<any> => {
    const response = await apiClient.get<any>('/papers', { params });
    return response.data;
  },

  getPaperById: async (id: string): Promise<any> => {
    const response = await apiClient.get<any>(`/papers/${id}`);
    return response.data;
  },

  createPaper: async (paperData: any): Promise<any> => {
    const response = await apiClient.post<any>('/papers/create', paperData);
    return response.data;
  },

  saveDraft: async (paperData: any): Promise<any> => {
    const response = await apiClient.post<any>('/papers/save-draft', paperData);
    return response.data;
  },

  publishPaper: async (id: string): Promise<any> => {
    const response = await apiClient.post<any>(`/papers/publish/${id}`);
    return response.data;
  },

  downloadPaper: async (id: string): Promise<void> => {
    try {
      const response = await apiClient.get(`/papers/${id}/download`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `paper-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  },

  deletePaper: async (id: string): Promise<void> => {
    await apiClient.delete(`/papers/${id}`);
  },
};
