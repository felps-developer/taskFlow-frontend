import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTasksResource } from '@/hooks/api/useTasksResource';
import { useUsersResource } from '@/hooks/api/useUsersResource';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import type { User } from '@/interfaces/user.interface';
import type { TaskStatus } from '@/interfaces/task.interface';

const taskSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'completed']),
  assigned_to: z.string().optional(),
  due_date: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function TaskFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const tasksResource = useTasksResource();
  const usersResource = useUsersResource();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: 'todo',
      priority: 'medium',
    },
  });

  useEffect(() => {
    loadUsers();

    if (id) {
      loadTask();
    }
  }, [id]);

  const loadUsers = async () => {
    try {
      const data = await usersResource.loadUsers();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const loadTask = async () => {
    try {
      const task = await tasksResource.findById(id!);
      setValue('title', task.title);
      setValue('description', task.description || '');
      setValue('status', task.status);
      setValue('assigned_to', task.assigned_to || '');
      setValue('due_date', task.due_date || '');
      setValue('priority', task.priority || 'medium');
    } catch (error) {
      console.error('Erro ao carregar tarefa:', error);
      setError('Erro ao carregar tarefa');
    }
  };

  const onSubmit = async (data: TaskFormData) => {
    setLoading(true);
    setError(null);

    try {
      if (id) {
        await tasksResource.update({ id, ...data });
      } else {
        await tasksResource.create(data);
      }
      navigate('/kanban');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar tarefa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{id ? 'Editar Tarefa' : 'Nova Tarefa'}</CardTitle>
          <CardDescription>
            {id ? 'Atualize as informações da tarefa' : 'Preencha os dados para criar uma nova tarefa'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input id="title" {...register('title')} />
              {errors.title && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                {...register('description')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register('status')}
              >
                <option value="todo">A Fazer</option>
                <option value="in_progress">Fazendo</option>
                <option value="completed">Concluída</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assigned_to">Atribuir a</Label>
              <select
                id="assigned_to"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register('assigned_to')}
              >
                <option value="">Nenhum</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <select
                id="priority"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register('priority')}
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Data de Vencimento</Label>
              <Input id="due_date" type="date" {...register('due_date')} />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

