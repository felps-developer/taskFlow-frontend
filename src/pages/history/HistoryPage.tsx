import { useEffect, useState } from 'react';
import { useTasksResource } from '@/hooks/api/useTasksResource';
import { useUsersResource } from '@/hooks/api/useUsersResource';
import { useAuthStore } from '@/stores/auth';
import { useRoles } from '@/hooks/useRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Filter, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Task } from '@/interfaces/task.interface';
import type { User } from '@/interfaces/user.interface';

export default function HistoryPage() {
  const { user } = useAuthStore();
  const { isAdmin } = useRoles();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Paginação (apenas para admin)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  
  // Filtros
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const tasksResource = useTasksResource();
  const usersResource = useUsersResource();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    loadData();
  }, [currentPage, selectedUser, startDate, endDate, user]);

  const loadUsers = async () => {
    try {
      const usersData = await usersResource.loadUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      if (isAdmin()) {
        // Admin: usa paginação do backend com todos os filtros
        const params: any = {
          page: currentPage,
          limit: limit,
          status: 'completed',
        };
        
        if (selectedUser) {
          params.responsible_id = selectedUser;
        }
        
        if (startDate) {
          params.start_date = startDate;
        }
        
        if (endDate) {
          params.end_date = endDate;
        }
        
        const result = await tasksResource.loadTasksPaginated(params);
        setTasks(result.data);
        setTotal(result.total);
        setTotalPages(result.last_page);
      } else {
        // Funcionário: carrega apenas suas tarefas (sem paginação)
        const filters: any = {
          status: 'completed',
          responsible_id: user?.id,
        };
        
        if (startDate) {
          filters.start_date = startDate;
        }
        
        if (endDate) {
          filters.end_date = endDate;
        }
        
        const tasksData = await tasksResource.loadTasks(filters);
        setTasks(tasksData);
        setTotal(tasksData.length);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedUser('');
    setStartDate('');
    setEndDate('');
    if (isAdmin()) {
      setCurrentPage(1);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getUserName = (userId?: string) => {
    if (!userId) return 'Não atribuído';
    const user = users.find((u) => u.id === userId);
    return user ? user.name : 'Usuário não encontrado';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não definida';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Histórico de Demandas Concluídas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isAdmin()
              ? 'Visualize todas as tarefas finalizadas do time'
              : 'Visualize suas tarefas finalizadas'}
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
        </Button>
      </div>

      {/* Filtros */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              {isAdmin()
                ? 'Filtre as tarefas concluídas por funcionário e data'
                : 'Filtre suas tarefas concluídas por data'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Filtro por funcionário (apenas admin) */}
              {isAdmin() && (
                <div className="space-y-2">
                  <Label htmlFor="user">Funcionário</Label>
                  <select
                    id="user"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedUser}
                    onChange={(e) => {
                      setSelectedUser(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">Todos os funcionários</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Data inicial */}
              <div className="space-y-2">
                <Label htmlFor="startDate">Data Inicial</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="startDate"
                    type="date"
                    className="pl-10"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (isAdmin()) setCurrentPage(1);
                    }}
                  />
                </div>
              </div>

              {/* Data final */}
              <div className="space-y-2">
                <Label htmlFor="endDate">Data Final</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="endDate"
                    type="date"
                    className="pl-10"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      if (isAdmin()) setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Button variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isAdmin() ? 'Total Concluídas' : 'Minhas Concluídas'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exibindo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
            {isAdmin() && (
              <p className="text-xs text-gray-500 mt-1">
                Página {currentPage} de {totalPages}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Conclusão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-green-600">
              {tasks.length > 0
                ? formatDate(
                    tasks.sort(
                      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                    )[0].updated_at
                  )
                : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de tarefas */}
      <Card>
        <CardHeader>
          <CardTitle>Demandas Concluídas</CardTitle>
          <CardDescription>
            {isAdmin()
              ? `${total} tarefa${total !== 1 ? 's' : ''} encontrada${total !== 1 ? 's' : ''}`
              : `${tasks.length} tarefa${tasks.length !== 1 ? 's' : ''} encontrada${tasks.length !== 1 ? 's' : ''}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Nenhuma tarefa concluída encontrada
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <Card key={task.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{task.title}</CardTitle>
                          {task.description && (
                            <CardDescription className="mt-2 line-clamp-2">
                              {task.description}
                            </CardDescription>
                          )}
                        </div>
                        {task.type && (
                          <span className="ml-4 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {task.type === 'landing_page' && 'Landing Page'}
                            {task.type === 'edicao' && 'Edição'}
                            {task.type === 'api' && 'API'}
                            {task.type === 'manutencao' && 'Manutenção'}
                            {task.type === 'urgente' && 'Urgente'}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {isAdmin() && (
                          <div>
                            <span className="font-semibold text-gray-600 dark:text-gray-400">
                              Responsável:
                            </span>
                            <p className="text-gray-900 dark:text-white">
                              {getUserName(task.assigned_to)}
                            </p>
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-gray-600 dark:text-gray-400">
                            Data de Vencimento:
                          </span>
                          <p className="text-gray-900 dark:text-white">{formatDate(task.due_date)}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-600 dark:text-gray-400">
                            Concluída em:
                          </span>
                          <p className="text-gray-900 dark:text-white">{formatDate(task.updated_at)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Paginação (apenas para admin) */}
              {isAdmin() && totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Mostrando {((currentPage - 1) * limit) + 1} a{' '}
                    {Math.min(currentPage * limit, total)} de {total} tarefas
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="min-w-[40px]"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
