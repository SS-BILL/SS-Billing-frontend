import axios from 'axios';
import type { MerchantStats, PaymentLog, Plan, RevenuePoint, Subscription } from '../types';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  /* Bounded so a hung request surfaces as an error the UI can show and retry,
     rather than a spinner that never resolves. */
  timeout: 15_000,
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Every endpoint returns its parsed body; errors propagate to the caller. */
export const merchantApi = {
  get: (id: string) => api.get<Plan>(`/merchants/${id}`).then((r) => r.data),
  update: (id: string, data: unknown) => api.patch(`/merchants/${id}`, data).then((r) => r.data),
};

export const planApi = {
  list: (merchantId: string) =>
    api.get<Plan[]>('/plans', { params: { merchantId } }).then((r) => r.data),
  create: (data: unknown) => api.post<Plan>('/plans', data).then((r) => r.data),
  update: (id: string, data: unknown) => api.patch<Plan>(`/plans/${id}`, data).then((r) => r.data),
  disable: (id: string) => api.delete<Plan>(`/plans/${id}`).then((r) => r.data),
};

export const subscriptionApi = {
  list: (address: string) =>
    api.get<Subscription[]>('/subscriptions', { params: { address } }).then((r) => r.data),
  get: (id: string) => api.get<Subscription>(`/subscriptions/${id}`).then((r) => r.data),
  pause: (id: string) => api.patch<Subscription>(`/subscriptions/${id}/pause`).then((r) => r.data),
  resume: (id: string) => api.patch<Subscription>(`/subscriptions/${id}/resume`).then((r) => r.data),
  cancel: (id: string) => api.delete<Subscription>(`/subscriptions/${id}`).then((r) => r.data),
  payments: (id: string) =>
    api.get<PaymentLog[]>(`/subscriptions/${id}/payments`).then((r) => r.data),
};

export const analyticsApi = {
  stats: (merchantId: string) =>
    api.get<MerchantStats>(`/analytics/merchants/${merchantId}/stats`).then((r) => r.data),
  revenue: (merchantId: string, days = 30) =>
    api
      .get<RevenuePoint[]>(`/analytics/merchants/${merchantId}/revenue`, { params: { days } })
      .then((r) => r.data),
};
