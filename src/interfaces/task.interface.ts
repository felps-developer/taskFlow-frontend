export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type BackendTaskStatus = 'pendente' | 'fazendo' | 'concluido';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assigned_to?: string;
  assigned_user?: {
    id: string;
    name: string;
    email: string;
  };
  created_by: string;
  created_by_user?: {
    id: string;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  assigned_to?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {
  id: string;
}

