import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// Resume APIs
export const resumeAPI = {
  upload: (formData) => {
    return api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  list: () => api.get('/resume/list'),
  getById: (id) => api.get(`/resume/${id}`),
  delete: (id) => api.delete(`/resume/${id}`),
  deleteAll: () => api.delete('/resume/all/clear'),
  download: (id) => api.get(`/resume/download/${id}`, { responseType: 'blob' }),
  exportExcel: () => api.get('/resume/export/excel', { responseType: 'blob' }),
  exportExcelById: (id) => api.get(`/resume/export/excel/${id}`, { responseType: 'blob' })
};

export default api;
