/**
 * Mapeamento entre os status do backend e frontend
 * Backend: 'pendente' | 'fazendo' | 'concluido'
 * Frontend: 'todo' | 'in_progress' | 'completed'
 */

export type BackendTaskStatus = 'pendente' | 'fazendo' | 'concluido';
export type FrontendTaskStatus = 'todo' | 'in_progress' | 'completed';

const statusMap: Record<BackendTaskStatus, FrontendTaskStatus> = {
  pendente: 'todo',
  fazendo: 'in_progress',
  concluido: 'completed',
};

const reverseStatusMap: Record<FrontendTaskStatus, BackendTaskStatus> = {
  todo: 'pendente',
  in_progress: 'fazendo',
  completed: 'concluido',
};

/**
 * Converte status do backend para o formato do frontend
 */
export function mapBackendToFrontendStatus(status: BackendTaskStatus): FrontendTaskStatus {
  return statusMap[status] || 'todo';
}

/**
 * Converte status do frontend para o formato do backend
 */
export function mapFrontendToBackendStatus(status: FrontendTaskStatus): BackendTaskStatus {
  return reverseStatusMap[status] || 'pendente';
}

