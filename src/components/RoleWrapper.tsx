import { ReactNode } from 'react';
import { useRoles, UserRole } from '@/hooks/useRoles';

interface RoleWrapperProps {
  role: UserRole | UserRole[];
  mode?: 'hide' | 'disable' | 'remove';
  fallback?: ReactNode;
  children: ReactNode;
}

export function RoleWrapper({
  role,
  mode = 'hide',
  fallback,
  children,
}: RoleWrapperProps) {
  const { hasRole, hasAnyRole } = useRoles();

  const hasAccess = Array.isArray(role)
    ? hasAnyRole(role)
    : hasRole(role);

  if (!hasAccess) {
    if (mode === 'remove') {
      return fallback ? <>{fallback}</> : null;
    }
    if (mode === 'disable') {
      return (
        <div className="pointer-events-none opacity-50" title="Acesso negado">
          {children}
        </div>
      );
    }
    return null;
  }

  return <>{children}</>;
}

