import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor: handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login:  (data) => api.post('/auth/login', data),
  me:     ()     => api.get('/auth/me'),
};

// Tasks
export const tasksAPI = {
  getAll:  ()           => api.get('/tasks'),
  create:  (data)       => api.post('/tasks', data),
  update:  (id, data)   => api.put(`/tasks/${id}`, data),
  remove:  (id)         => api.delete(`/tasks/${id}`),
};

// Interviews
export const interviewsAPI = {
  getAll:  ()           => api.get('/interviews'),
  create:  (data)       => api.post('/interviews', data),
  update:  (id, data)   => api.put(`/interviews/${id}`, data),
  remove:  (id)         => api.delete(`/interviews/${id}`),
};

// AI
export const aiAPI = {
  getSuggestions: (data) => api.post('/ai/suggestions', data),
};

export default api;
