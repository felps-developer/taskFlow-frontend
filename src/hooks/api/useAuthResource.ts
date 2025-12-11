import { api } from '@/lib/api';
import type { AuthResponse, LoginCredentials } from '@/interfaces/user.interface';

export function useAuthResource() {
  const getToken = (): string | null => {
    return localStorage.getItem('token');
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  };

  const getProfile = async (): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/auth/me');
    return response.data;
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  };

  return {
    getToken,
    login,
    getProfile,
    logout,
  };
}

