import { api } from '@/lib/api';
import type { CreateTaskDto, Task, UpdateTaskDto, BackendTaskStatus } from '@/interfaces/task.interface';
import { mapBackendToFrontendStatus, mapFrontendToBackendStatus } from '@/utils/taskStatusMapper';

interface BackendTask {
  id: string;
  title: string;
  description: string;
  type: 'landing_page' | 'edicao' | 'api' | 'manutencao' | 'urgente';
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
  // Converte deadline (ISO 8601) para formato YYYY-MM-DD para o input date
  let dueDate = backendTask.deadline;
  if (dueDate) {
    try {
      const date = new Date(dueDate);
      if (!isNaN(date.getTime())) {
        dueDate = date.toISOString().split('T')[0];
      }
    } catch (e) {
      // Se falhar, mantém o valor original
    }
  }
  
  return {
    id: backendTask.id,
    title: backendTask.title,
    description: backendTask.description,
    type: backendTask.type,
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
    due_date: dueDate,
  };
}

export function useTasksResource() {
  const loadTasks = async (filters?: {
    status?: 'todo' | 'in_progress' | 'completed';
    responsible_id?: string;
    title?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<Task[]> => {
    const params = new URLSearchParams();
    
    if (filters?.status) {
      params.append('status', mapFrontendToBackendStatus(filters.status));
    }
    if (filters?.responsible_id) {
      params.append('responsible_id', filters.responsible_id);
    }
    if (filters?.title) {
      params.append('title', filters.title);
    }
    if (filters?.start_date) {
      params.append('start_date', filters.start_date);
    }
    if (filters?.end_date) {
      params.append('end_date', filters.end_date);
    }
    
    const queryString = params.toString();
    const url = `/api/tasks/list${queryString ? `?${queryString}` : ''}`;
    const response = await api.get<BackendListResponse<BackendTask>>(url);
    const tasks = response.data.data || [];
    return tasks.map(mapBackendTaskToFrontend);
  };

  interface PaginatedTasksResult {
    data: Task[];
    total: number;
    page: number;
    last_page: number;
    limit: number;
  }

  const loadTasksPaginated = async (params: {
    page?: number;
    limit?: number;
    status?: 'todo' | 'in_progress' | 'completed';
    responsible_id?: string;
    title?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<PaginatedTasksResult> => {
    const queryParams = new URLSearchParams();
    
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.status) {
      queryParams.append('status', mapFrontendToBackendStatus(params.status));
    }
    if (params.responsible_id) {
      queryParams.append('responsible_id', params.responsible_id);
    }
    if (params.title) {
      queryParams.append('title', params.title);
    }
    if (params.start_date) {
      queryParams.append('start_date', params.start_date);
    }
    if (params.end_date) {
      queryParams.append('end_date', params.end_date);
    }
    
    const queryString = queryParams.toString();
    const url = `/api/tasks${queryString ? `?${queryString}` : ''}`;
    const response = await api.get<{
      success: boolean;
      data: BackendTask[];
      total: number;
      page: number;
      last_page: number;
      limit: number;
    }>(url);
    
    return {
      data: response.data.data.map(mapBackendTaskToFrontend),
      total: response.data.total,
      page: response.data.page,
      last_page: response.data.last_page,
      limit: response.data.limit,
    };
  };

  const findById = async (id: string): Promise<Task> => {
    const response = await api.get<BackendResponse<BackendTask>>(`/api/tasks/${id}`);
    return mapBackendTaskToFrontend(response.data.data);
  };

  const create = async (data: CreateTaskDto): Promise<Task> => {
    // Converte a data para ISO 8601
    // Se for apenas data (YYYY-MM-DD), converte para ISO 8601
    let deadline = data.due_date;
    if (deadline) {
      if (!deadline.includes('T')) {
        // Formato YYYY-MM-DD -> converte para ISO 8601
        deadline = new Date(deadline + 'T00:00:00').toISOString();
      } else if (!deadline.endsWith('Z') && !deadline.includes('+')) {
        // Se já tem T mas não tem timezone, adiciona Z
        deadline = new Date(deadline).toISOString();
      }
    }
    
    const backendData = {
      title: data.title,
      description: data.description,
      type: data.type,
      status: data.status ? mapFrontendToBackendStatus(data.status) : 'pendente',
      responsible_id: data.assigned_to,
      deadline: deadline,
    };
    const response = await api.post<BackendResponse<BackendTask>>('/api/tasks', backendData);
    return mapBackendTaskToFrontend(response.data.data);
  };

  const update = async (data: UpdateTaskDto): Promise<Task> => {
    const { id, ...updateData } = data;
    const backendData: any = {};
    if (updateData.title) backendData.title = updateData.title;
    if (updateData.description !== undefined) backendData.description = updateData.description;
    if (updateData.type) backendData.type = updateData.type;
    if (updateData.status) backendData.status = mapFrontendToBackendStatus(updateData.status);
    if (updateData.assigned_to) backendData.responsible_id = updateData.assigned_to;
    if (updateData.due_date) {
      // Converte a data para ISO 8601
      let deadline = updateData.due_date;
      if (deadline) {
        if (!deadline.includes('T')) {
          deadline = new Date(deadline + 'T00:00:00').toISOString();
        } else if (!deadline.endsWith('Z') && !deadline.includes('+')) {
          deadline = new Date(deadline).toISOString();
        }
      }
      backendData.deadline = deadline;
    }
    
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
    loadTasksPaginated,
    findById,
    create,
    update,
    remove,
    updateStatus,
  };
}

