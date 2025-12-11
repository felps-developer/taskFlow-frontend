import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import type { PermissionKey } from '@/interfaces/permission.interface';

interface PermissionWrapperProps {
  permission: PermissionKey | PermissionKey[];
  mode?: 'hide' | 'disable' | 'remove';
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionWrapper({
  permission,
  mode = 'hide',
  fallback,
  children,
}: PermissionWrapperProps) {
  const { hasPermission, hasAnyPermission } = usePermissions();

  const hasAccess = Array.isArray(permission)
    ? hasAnyPermission(permission)
    : hasPermission(permission);

  if (!hasAccess) {
    if (mode === 'remove') {
      return fallback ? <>{fallback}</> : null;
    }
    if (mode === 'disable') {
      return (
        <div className="pointer-events-none opacity-50" title="Sem permissão">
          {children}
        </div>
      );
    }
    return null;
  }

  return <>{children}</>;
}

