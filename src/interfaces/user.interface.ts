export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  position?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

