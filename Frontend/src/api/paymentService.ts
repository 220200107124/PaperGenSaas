import apiClient from './apiClient';

export interface RazorpayOrder {
  orderId: string;
  amount?: number;
  currency?: string;
}

export const paymentService = {
  createOrder: async (amount: number): Promise<RazorpayOrder> => {
    const response = await apiClient.post<RazorpayOrder>('/payments/create-order', { amount });
    return (response.data as any).data || response.data;
  },
  createPayPalOrder: async (data: { amount: number }): Promise<{ orderId: string, amount?: number, currency?: string }> => {
    const response = await apiClient.post('/payments/create-order', data);
    return response.data.data || response.data; // unwrapping NestJS interceptor { data: {...} }
  },

  capturePayPalOrder: async (data: { 
    orderId: string,
    paymentId?: string,
    signature?: string,
    userId: string, 
    planId: string, 
    schoolId?: string, 
    type: 'teacher' | 'school' 
  }): Promise<any> => {
    const response = await apiClient.post('/payments/capture-order', data);
    return response.data.data || response.data;
  },

  verifyPayment: async (paymentData: any): Promise<any> => {
    const response = await apiClient.post('/payments/verify', paymentData);
    return response.data.data || response.data;
  },

  verifyPayPalPayment: async (paymentData: any): Promise<any> => {
    const response = await apiClient.post('/payments/paypal/verify', paymentData);
    return response.data.data || response.data;
  }
};
