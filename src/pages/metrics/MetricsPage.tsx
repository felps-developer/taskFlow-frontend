import { useEffect, useState } from 'react';
import { useTasksResource } from '@/hooks/api/useTasksResource';
import { useUsersResource } from '@/hooks/api/useUsersResource';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { Task } from '@/interfaces/task.interface';
import type { User } from '@/interfaces/user.interface';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function MetricsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const tasksResource = useTasksResource();
  const usersResource = useUsersResource();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, usersData] = await Promise.all([
        tasksResource.loadTasks(),
        usersResource.loadUsers(),
      ]);
      setTasks(tasksData);
      setUsers(usersData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Dados para gráfico de status
  const statusData = [
    { name: 'A Fazer', value: tasks.filter((t) => t.status === 'todo').length },
    { name: 'Fazendo', value: tasks.filter((t) => t.status === 'in_progress').length },
    { name: 'Concluídas', value: tasks.filter((t) => t.status === 'completed').length },
  ];

  // Dados por funcionário
  const tasksByUser = users.map((user) => {
    const userTasks = tasks.filter((t) => t.assigned_to === user.id);
    return {
      name: user.name,
      total: userTasks.length,
      completed: userTasks.filter((t) => t.status === 'completed').length,
      inProgress: userTasks.filter((t) => t.status === 'in_progress').length,
      todo: userTasks.filter((t) => t.status === 'todo').length,
    };
  });

  // Estatísticas gerais
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    completionRate: tasks.length > 0 ? (tasks.filter((t) => t.status === 'completed').length / tasks.length) * 100 : 0,
    averagePerUser: users.length > 0 ? tasks.length / users.length : 0,
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Métricas</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Análise de produtividade e desempenho do time
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Funcionário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averagePerUser.toFixed(1)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Status */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Tarefas por Status</CardTitle>
          <CardDescription>Visualização das tarefas em cada status</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico por Funcionário */}
      <Card>
        <CardHeader>
          <CardTitle>Produtividade por Funcionário</CardTitle>
          <CardDescription>Distribuição de tarefas por membro do time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={tasksByUser}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="todo" stackId="a" fill="#FFBB28" name="A Fazer" />
              <Bar dataKey="inProgress" stackId="a" fill="#0088FE" name="Fazendo" />
              <Bar dataKey="completed" stackId="a" fill="#00C49F" name="Concluídas" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

