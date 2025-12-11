import { Navigate } from 'react-router-dom';
import { useRoles, UserRole } from '@/hooks/useRoles';

interface RoleGuardProps {
  children: React.ReactNode;
  role: UserRole | UserRole[];
  redirectTo?: string;
}

export function RoleGuard({
  children,
  role,
  redirectTo = '/dashboard',
}: RoleGuardProps) {
  const { hasRole, hasAnyRole } = useRoles();

  const hasAccess = Array.isArray(role)
    ? hasAnyRole(role)
    : hasRole(role);

  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

