import { useEffect, useState } from 'react';
import { useTasksResource } from '@/hooks/api/useTasksResource';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PermissionWrapper } from '@/components/PermissionWrapper';
import { TASK_PERMISSIONS } from '@/constants/permissions';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Task, TaskStatus } from '@/interfaces/task.interface';

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'todo', title: 'A Fazer', color: 'bg-yellow-100 dark:bg-yellow-900/20' },
  { id: 'in_progress', title: 'Fazendo', color: 'bg-blue-100 dark:bg-blue-900/20' },
  { id: 'completed', title: 'Concluídas', color: 'bg-green-100 dark:bg-green-900/20' },
];

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const tasksResource = useTasksResource();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await tasksResource.loadTasks();
      setTasks(data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await tasksResource.updateStatus(taskId, newStatus);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
      );
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

    try {
      await tasksResource.remove(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kanban</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Organize suas tarefas em colunas
          </p>
        </div>
        <PermissionWrapper permission={TASK_PERMISSIONS.CREATE}>
          <Button onClick={() => navigate('/tasks/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </PermissionWrapper>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);

          return (
            <div key={column.id} className="space-y-4">
              <div className={`${column.color} p-4 rounded-lg`}>
                <h2 className="font-semibold text-lg">{column.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {columnTasks.length} tarefa{columnTasks.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <Card key={task.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{task.title}</CardTitle>
                      {task.description && (
                        <CardDescription className="line-clamp-2">
                          {task.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      {task.assigned_user && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Atribuído a: {task.assigned_user.name}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <PermissionWrapper permission={TASK_PERMISSIONS.UPDATE}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/tasks/${task.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </PermissionWrapper>
                        <PermissionWrapper permission={TASK_PERMISSIONS.DELETE}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(task.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </PermissionWrapper>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    Nenhuma tarefa nesta coluna
                  </div>
                )}
              </div>

              {/* Botões para mover entre colunas */}
              {column.id !== 'completed' && (
                <div className="flex gap-2">
                  {column.id === 'todo' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const nextTask = columnTasks[0];
                        if (nextTask) handleStatusChange(nextTask.id, 'in_progress');
                      }}
                      disabled={columnTasks.length === 0}
                    >
                      Mover para Fazendo
                    </Button>
                  )}
                  {column.id === 'in_progress' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          const nextTask = columnTasks[0];
                          if (nextTask) handleStatusChange(nextTask.id, 'todo');
                        }}
                        disabled={columnTasks.length === 0}
                      >
                        Voltar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          const nextTask = columnTasks[0];
                          if (nextTask) handleStatusChange(nextTask.id, 'completed');
                        }}
                        disabled={columnTasks.length === 0}
                      >
                        Concluir
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

