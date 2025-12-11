import { useAuthStore } from '@/stores/auth';

export type UserRole = 'admin' | 'funcionario' | 'employee';

/**
 * Hook simplificado para verificação de roles
 * Baseado no sistema do backend que usa apenas roles (admin/funcionario)
 */
export function useRoles() {
  const { user } = useAuthStore();

  /**
   * Verifica se o usuário é administrador
   */
  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  /**
   * Verifica se o usuário é funcionário
   */
  const isEmployee = (): boolean => {
    return user?.role === 'funcionario' || user?.role === 'employee';
  };

  /**
   * Verifica se o usuário tem um role específico
   */
  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    
    // Normaliza 'employee' para 'funcionario' para compatibilidade
    const userRole = user.role === 'employee' ? 'funcionario' : user.role;
    const checkRole = role === 'employee' ? 'funcionario' : role;
    
    return userRole === checkRole;
  };

  /**
   * Verifica se o usuário tem qualquer um dos roles fornecidos
   */
  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user || !roles || roles.length === 0) return false;
    return roles.some((role) => hasRole(role));
  };

  /**
   * Verifica se o usuário pode criar usuários (apenas admin)
   */
  const canCreateUsers = (): boolean => {
    return isAdmin();
  };

  /**
   * Verifica se o usuário pode deletar tarefas (apenas admin)
   */
  const canDeleteTasks = (): boolean => {
    return isAdmin();
  };

  /**
   * Verifica se o usuário pode ver métricas (apenas admin)
   */
  const canViewMetrics = (): boolean => {
    return isAdmin();
  };

  return {
    user,
    isAdmin,
    isEmployee,
    hasRole,
    hasAnyRole,
    canCreateUsers,
    canDeleteTasks,
    canViewMetrics,
  };
}

