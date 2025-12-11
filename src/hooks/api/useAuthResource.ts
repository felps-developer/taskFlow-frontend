import { api } from '@/lib/api';
import type { AuthResponse, LoginCredentials, User } from '@/interfaces/user.interface';

interface BackendLoginResponse {
  success: boolean;
  access_token: string;
}

interface BackendMeResponse {
  success: boolean;
  data: User;
}

export function useAuthResource() {
  const getToken = (): string | null => {
    return localStorage.getItem('token');
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Faz login e recebe o token
    const response = await api.post<BackendLoginResponse>('/api/auth/login', credentials);
    
    // O interceptor já salva o token automaticamente, mas garantimos que está salvo
    const token = response.data.access_token;
    if (!token) {
      throw new Error('Token não recebido do servidor');
    }
    
    localStorage.setItem('token', token);
    
    // Aguarda um pouco para garantir que o token foi salvo
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    // Busca os dados do usuário
    // O interceptor adiciona o token automaticamente
    const profileResponse = await api.get<BackendMeResponse>('/api/auth/me');
    const user = profileResponse.data.data;
    
    return {
      user,
      token,
    };
  };

  const getProfile = async (): Promise<AuthResponse> => {
    const response = await api.get<BackendMeResponse>('/api/auth/me');
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token não encontrado');
    }
    
    return {
      user: response.data.data,
      token,
    };
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

