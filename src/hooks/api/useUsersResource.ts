import { api } from '@/lib/api';
import type { User } from '@/interfaces/user.interface';

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'employee';
  position?: string;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  id: string;
}

export function useUsersResource() {
  const loadUsers = async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  };

  const findById = async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  };

  const create = async (data: CreateUserDto): Promise<User> => {
    const response = await api.post<User>('/users', data);
    return response.data;
  };

  const update = async (data: UpdateUserDto): Promise<User> => {
    const { id, ...updateData } = data;
    const response = await api.put<User>(`/users/${id}`, updateData);
    return response.data;
  };

  const remove = async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  };

  return {
    loadUsers,
    findById,
    create,
    update,
    remove,
  };
}

