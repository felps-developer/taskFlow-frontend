import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../interfaces/user.interface';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token });
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        set({ user: null, token: null, isAuthenticated: false });
      },
      initializeAuth: () => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            set({ user, token, isAuthenticated: true });
          } catch (error) {
            console.error('Erro ao inicializar autenticação:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

