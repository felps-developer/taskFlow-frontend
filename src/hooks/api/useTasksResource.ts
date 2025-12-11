import { api } from '@/lib/api';
import type { CreateTaskDto, Task, UpdateTaskDto } from '@/interfaces/task.interface';

export function useTasksResource() {
  const loadTasks = async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  };

  const findById = async (id: string): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  };

  const create = async (data: CreateTaskDto): Promise<Task> => {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  };

  const update = async (data: UpdateTaskDto): Promise<Task> => {
    const { id, ...updateData } = data;
    const response = await api.put<Task>(`/tasks/${id}`, updateData);
    return response.data;
  };

  const remove = async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  };

  const updateStatus = async (id: string, status: Task['status']): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}/status`, { status });
    return response.data;
  };

  return {
    loadTasks,
    findById,
    create,
    update,
    remove,
    updateStatus,
  };
}

