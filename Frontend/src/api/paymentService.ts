import apiClient from './apiClient';

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

export const paymentService = {
  createOrder: async (amount: number): Promise<RazorpayOrder> => {
    const response = await apiClient.post<RazorpayOrder>('/payments/create-order', { amount });
    return response.data;
  },

  verifyPayment: async (paymentData: any): Promise<any> => {
    const response = await apiClient.post('/payments/verify', paymentData);
    return response.data;
  }
};
