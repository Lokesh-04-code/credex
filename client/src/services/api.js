/**
 * API Service — Axios-based
 * All backend calls go through this module.
 */

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor — normalize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const auditApi = {
  /**
   * Submit audit form and get results
   */
  createAudit: async (payload) => {
    const { data } = await api.post('/api/audit', payload);
    return data;
  },

  /**
   * Get public audit by share ID
   */
  getAudit: async (shareId) => {
    const { data } = await api.get(`/api/audit/${shareId}`);
    return data;
  },
};

export const leadsApi = {
  /**
   * Capture a lead
   */
  createLead: async (payload) => {
    const { data } = await api.post('/api/leads', payload);
    return data;
  },
};

export default api;
