import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('attendio_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    institutionCode: string;
  }) => {
    const response = await api.post('/auth/register', payload);
    return response.data;
  },
};

export const subjectApi = {
  list: async () => api.get('/subjects').then((response) => response.data.subjects),
  create: async (payload: { code: string; name: string; threshold?: number }) =>
    api.post('/subjects', payload).then((response) => response.data.subject),
  addAttendance: async (subjectId: string, payload: { attended: boolean; date?: string; type?: string; remarks?: string }) =>
    api.post(`/subjects/${subjectId}/attendance`, payload).then((response) => response.data),
};

export const dashboardApi = {
  get: async () => api.get('/users/me').then((response) => response.data),
  summary: async () => api.get('/users/me/reports/summary').then((response) => response.data),
  safeSkip: async (subjectId: string) => api.get(`/calculations/${subjectId}/safe-skip`).then((response) => response.data),
};

export default api;
