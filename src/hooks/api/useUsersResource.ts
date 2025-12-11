import { api } from '@/lib/api';
import type { User } from '@/interfaces/user.interface';

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'funcionario';
  // position não existe no backend, será removido antes de enviar
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  id: string;
}

interface BackendResponse<T> {
  success: boolean;
  data: T;
}

interface BackendListResponse<T> {
  success: boolean;
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
}

export function useUsersResource() {
  const loadUsers = async (): Promise<User[]> => {
    const response = await api.get<BackendListResponse<User>>('/api/users/list');
    return response.data.data || [];
  };

  const findById = async (id: string): Promise<User> => {
    const response = await api.get<BackendResponse<User>>(`/api/users/${id}`);
    return response.data.data;
  };

  const create = async (data: CreateUserDto & { position?: string }): Promise<User> => {
    // Garante que o role seja 'funcionario' ou 'admin' (backend não aceita 'employee')
    // Remove campos que não existem no backend (position)
    const { position, ...backendData } = data;
    const payload = {
      ...backendData,
      role: backendData.role === 'employee' ? 'funcionario' : backendData.role,
    };
    const response = await api.post<BackendResponse<User>>('/api/users', payload);
    return response.data.data;
  };

  const update = async (data: UpdateUserDto & { position?: string }): Promise<User> => {
    const { id, position, password, ...updateData } = data;
    // Garante que o role seja 'funcionario' ou 'admin' (backend não aceita 'employee')
    // Remove campos que não existem no backend (position)
    // Só inclui password se foi fornecido
    const payload: any = {
      ...updateData,
      role: updateData.role === 'employee' ? 'funcionario' : updateData.role,
    };
    if (password) {
      payload.password = password;
    }
    const response = await api.put<BackendResponse<User>>(`/api/users/${id}`, payload);
    return response.data.data;
  };

  const remove = async (id: string): Promise<void> => {
    await api.delete(`/api/users/${id}`);
  };

  return {
    loadUsers,
    findById,
    create,
    update,
    remove,
  };
}

