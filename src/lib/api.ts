import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_URI = import.meta.env.VITE_API_URI || 'http://localhost:3001';

const api: AxiosInstance = axios.create({
  baseURL: API_URI,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta
api.interceptors.response.use(
  (response) => {
    // Verifica se a resposta contém um token e o armazena
    if (response.data && typeof response.data === 'object' && 'access_token' in response.data) {
      const token = (response.data as { access_token: string }).access_token;
      if (token) {
        localStorage.setItem('token', token);
      }
    }
    return response;
  },
  (error: AxiosError) => {
    // Verifica se o erro é 401 (Unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      
      // Redireciona para login se não estiver já na página de auth
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export { api, API_URI };

