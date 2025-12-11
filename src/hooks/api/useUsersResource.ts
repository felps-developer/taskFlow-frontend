import { api } from '@/lib/api';
import type { User } from '@/interfaces/user.interface';

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'employee' | 'funcionario';
  position?: string;
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

  const create = async (data: CreateUserDto): Promise<User> => {
    const response = await api.post<BackendResponse<User>>('/api/users', data);
    return response.data.data;
  };

  const update = async (data: UpdateUserDto): Promise<User> => {
    const { id, ...updateData } = data;
    const response = await api.put<BackendResponse<User>>(`/api/users/${id}`, updateData);
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

