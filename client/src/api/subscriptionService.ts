import apiClient from './apiClient';
import type { Subscription, SubscriptionPlan } from '../types';

export const subscriptionService = {
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await apiClient.get<SubscriptionPlan[]>('/subscriptions/plans');
    return response.data;
  },

  getSubscriptions: async (): Promise<Subscription[]> => {
    const response = await apiClient.get<Subscription[]>('/subscriptions');
    return response.data;
  },

  getSubscriptionBySchool: async (schoolId: string): Promise<Subscription> => {
    const response = await apiClient.get<Subscription>(`/subscriptions/school/${schoolId}`);
    return response.data;
  },

  createSubscription: async (subscriptionData: any): Promise<Subscription> => {
    const response = await apiClient.post<Subscription>('/subscriptions', subscriptionData);
    return response.data;
  },
};
