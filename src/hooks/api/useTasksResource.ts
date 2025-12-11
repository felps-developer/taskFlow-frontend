import { api } from '@/lib/api';
import type { CreateTaskDto, Task, UpdateTaskDto, BackendTaskStatus } from '@/interfaces/task.interface';
import { mapBackendToFrontendStatus, mapFrontendToBackendStatus } from '@/utils/taskStatusMapper';

interface BackendTask {
  id: string;
  title: string;
  description: string;
  status: BackendTaskStatus;
  responsible_id?: string;
  responsible_name?: string;
  deadline?: string;
  created_at?: string;
  updated_at?: string;
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

function mapBackendTaskToFrontend(backendTask: BackendTask): Task {
  return {
    id: backendTask.id,
    title: backendTask.title,
    description: backendTask.description,
    status: mapBackendToFrontendStatus(backendTask.status),
    assigned_to: backendTask.responsible_id,
    assigned_user: backendTask.responsible_name
      ? {
          id: backendTask.responsible_id || '',
          name: backendTask.responsible_name,
          email: '',
        }
      : undefined,
    created_by: '',
    created_at: backendTask.created_at || '',
    updated_at: backendTask.updated_at || '',
    due_date: backendTask.deadline,
  };
}

export function useTasksResource() {
  const loadTasks = async (): Promise<Task[]> => {
    const response = await api.get<BackendListResponse<BackendTask>>('/api/tasks/list');
    const tasks = response.data.data || [];
    return tasks.map(mapBackendTaskToFrontend);
  };

  const findById = async (id: string): Promise<Task> => {
    const response = await api.get<BackendResponse<BackendTask>>(`/api/tasks/${id}`);
    return mapBackendTaskToFrontend(response.data.data);
  };

  const create = async (data: CreateTaskDto): Promise<Task> => {
    const backendData = {
      title: data.title,
      description: data.description || '',
      status: data.status ? mapFrontendToBackendStatus(data.status) : 'pendente',
      responsible_id: data.assigned_to,
      deadline: data.due_date,
    };
    const response = await api.post<BackendResponse<BackendTask>>('/api/tasks', backendData);
    return mapBackendTaskToFrontend(response.data.data);
  };

  const update = async (data: UpdateTaskDto): Promise<Task> => {
    const { id, ...updateData } = data;
    const backendData: any = {};
    if (updateData.title) backendData.title = updateData.title;
    if (updateData.description !== undefined) backendData.description = updateData.description;
    if (updateData.status) backendData.status = mapFrontendToBackendStatus(updateData.status);
    if (updateData.assigned_to) backendData.responsible_id = updateData.assigned_to;
    if (updateData.due_date) backendData.deadline = updateData.due_date;
    
    const response = await api.put<BackendResponse<BackendTask>>(`/api/tasks/${id}`, backendData);
    return mapBackendTaskToFrontend(response.data.data);
  };

  const remove = async (id: string): Promise<void> => {
    await api.delete(`/api/tasks/${id}`);
  };

  const updateStatus = async (id: string, status: Task['status']): Promise<Task> => {
    // Usa o método update normal, passando apenas o status convertido
    const backendStatus = mapFrontendToBackendStatus(status);
    const response = await api.put<BackendResponse<BackendTask>>(`/api/tasks/${id}`, {
      status: backendStatus,
    });
    return mapBackendTaskToFrontend(response.data.data);
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

