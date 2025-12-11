export type PermissionKey =
  | 'TASKS_LIST'
  | 'TASKS_CREATE'
  | 'TASKS_UPDATE'
  | 'TASKS_DELETE'
  | 'USERS_LIST'
  | 'USERS_CREATE'
  | 'USERS_UPDATE'
  | 'USERS_DELETE'
  | 'DASHBOARD_VIEW'
  | 'METRICS_VIEW';

export interface Permission {
  key: PermissionKey;
  key_group: string;
  name: string;
  description?: string;
}

export interface ModuleCRUDPermissions {
  canList: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

