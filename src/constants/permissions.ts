import type { PermissionKey } from '../interfaces/permission.interface';

export const PERMISSION_ACTIONS = {
  LIST: 'LIST',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const;

export function buildPermissionKey(module: string, action: string): PermissionKey {
  return `${module.toUpperCase()}_${action.toUpperCase()}` as PermissionKey;
}

// Permissões por módulo
export const TASK_PERMISSIONS = {
  LIST: 'TASKS_LIST' as PermissionKey,
  CREATE: 'TASKS_CREATE' as PermissionKey,
  UPDATE: 'TASKS_UPDATE' as PermissionKey,
  DELETE: 'TASKS_DELETE' as PermissionKey,
};

export const USER_PERMISSIONS = {
  LIST: 'USERS_LIST' as PermissionKey,
  CREATE: 'USERS_CREATE' as PermissionKey,
  UPDATE: 'USERS_UPDATE' as PermissionKey,
  DELETE: 'USERS_DELETE' as PermissionKey,
};

export const DASHBOARD_PERMISSIONS = {
  VIEW: 'DASHBOARD_VIEW' as PermissionKey,
  METRICS: 'METRICS_VIEW' as PermissionKey,
};

