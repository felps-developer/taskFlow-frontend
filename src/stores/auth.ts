import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../interfaces/user.interface';
import type { Permission } from '../interfaces/permission.interface';

interface AuthState {
  user: User | null;
  permissions: Permission[];
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setPermissions: (permissions: Permission[]) => void;
  setToken: (token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      permissions: [],
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setPermissions: (permissions) => set({ permissions }),
      setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, permissions: [], token: null, isAuthenticated: false });
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
        permissions: state.permissions,
      }),
    }
  )
);

