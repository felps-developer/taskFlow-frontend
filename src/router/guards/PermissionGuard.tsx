import { Navigate } from 'react-router-dom';
import { usePermissions } from '@/hooks/usePermissions';
import type { PermissionKey } from '@/interfaces/permission.interface';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: PermissionKey | PermissionKey[];
  redirectTo?: string;
}

export function PermissionGuard({
  children,
  permission,
  redirectTo = '/dashboard',
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission } = usePermissions();

  const hasAccess = Array.isArray(permission)
    ? hasAnyPermission(permission)
    : hasPermission(permission);

  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

