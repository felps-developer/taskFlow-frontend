import { useMemo } from 'react';
import { useAuthStore } from '@/stores/auth';
import type { Permission, PermissionKey, ModuleCRUDPermissions } from '@/interfaces/permission.interface';
import { buildPermissionKey, PERMISSION_ACTIONS } from '@/constants/permissions';

// Cache global para validações de permissão
const permissionCache = new Map<string, boolean>();

export function usePermissions() {
  const { permissions } = useAuthStore();

  // Mapa de permissões para acesso O(1)
  const permissionsMap = useMemo(() => {
    const map = new Map<string, Permission>();
    permissions.forEach((permission) => {
      if (permission.key) {
        map.set(permission.key, permission);
      }
    });
    return map;
  }, [permissions]);

  // Mapa de grupos de permissões
  const permissionsByGroup = useMemo(() => {
    const map = new Map<string, Permission[]>();
    permissions.forEach((permission) => {
      if (permission.key_group) {
        if (!map.has(permission.key_group)) {
          map.set(permission.key_group, []);
        }
        map.get(permission.key_group)?.push(permission);
      }
    });
    return map;
  }, [permissions]);

  /**
   * Verifica se o usuário tem uma permissão específica
   */
  const hasPermission = (key: PermissionKey): boolean => {
    if (!key) return false;

    const cacheKey = `perm_${key}`;
    if (permissionCache.has(cacheKey)) {
      return permissionCache.get(cacheKey)!;
    }

    const result = permissionsMap.has(key);
    permissionCache.set(cacheKey, result);
    return result;
  };

  /**
   * Verifica se o usuário tem qualquer uma das permissões fornecidas (OR)
   */
  const hasAnyPermission = (keys: PermissionKey[]): boolean => {
    if (!keys || keys.length === 0) return false;
    return keys.some((key) => hasPermission(key));
  };

  /**
   * Verifica se o usuário tem todas as permissões fornecidas (AND)
   */
  const hasAllPermissions = (keys: PermissionKey[]): boolean => {
    if (!keys || keys.length === 0) return false;
    return keys.every((key) => hasPermission(key));
  };

  /**
   * Verifica se o usuário pode listar registros de um módulo
   */
  const canList = (module: string): boolean => {
    return hasPermission(buildPermissionKey(module, PERMISSION_ACTIONS.LIST));
  };

  /**
   * Verifica se o usuário pode criar registros de um módulo
   */
  const canCreate = (module: string): boolean => {
    return hasPermission(buildPermissionKey(module, PERMISSION_ACTIONS.CREATE));
  };

  /**
   * Verifica se o usuário pode editar registros de um módulo
   */
  const canUpdate = (module: string): boolean => {
    return hasPermission(buildPermissionKey(module, PERMISSION_ACTIONS.UPDATE));
  };

  /**
   * Verifica se o usuário pode excluir registros de um módulo
   */
  const canDelete = (module: string): boolean => {
    return hasPermission(buildPermissionKey(module, PERMISSION_ACTIONS.DELETE));
  };

  /**
   * Retorna todas as permissões CRUD de um módulo
   */
  const getModuleCRUDPermissions = (module: string): ModuleCRUDPermissions => {
    return {
      canList: canList(module),
      canCreate: canCreate(module),
      canUpdate: canUpdate(module),
      canDelete: canDelete(module),
    };
  };

  /**
   * Verifica se o usuário é administrador
   */
  const isAdmin = (): boolean => {
    const { user } = useAuthStore.getState();
    return user?.role === 'admin';
  };

  /**
   * Limpa o cache de permissões
   */
  const clearCache = (): void => {
    permissionCache.clear();
  };

  return {
    permissions,
    permissionsMap,
    permissionsByGroup,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canList,
    canCreate,
    canUpdate,
    canDelete,
    getModuleCRUDPermissions,
    isAdmin,
    clearCache,
  };
}

