import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { useRoles } from '@/hooks/useRoles';
import { RoleWrapper } from '@/components/RoleWrapper';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Kanban, Users, BarChart3, Menu, History } from 'lucide-react';
import { useState } from 'react';

export default function MainLayout() {
  const { user, logout } = useAuthStore();
  const { isAdmin } = useRoles();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">TaskFlow</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user?.name || 'Usuário'}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 lg:translate-x-0`}
        >
          <nav className="h-full p-4 space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/kanban"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Kanban className="h-5 w-5" />
              <span>Kanban</span>
            </Link>

            <Link
              to="/history"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <History className="h-5 w-5" />
              <span>Histórico</span>
            </Link>

            <RoleWrapper role="admin">
              <Link
                to="/users/new"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Users className="h-5 w-5" />
                <span>Cadastrar Funcionário</span>
              </Link>
            </RoleWrapper>

            <RoleWrapper role="admin">
              <Link
                to="/metrics"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <BarChart3 className="h-5 w-5" />
                <span>Métricas</span>
              </Link>
            </RoleWrapper>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

