import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from './guards/AuthGuard';
import { RoleGuard } from './guards/RoleGuard';

// Layouts
import AuthLayout from '@/layouts/AuthLayout';
import MainLayout from '@/layouts/MainLayout';

// Pages
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import KanbanPage from '@/pages/kanban/KanbanPage';
import TaskFormPage from '@/pages/tasks/TaskFormPage';
import UserFormPage from '@/pages/users/UserFormPage';
import MetricsPage from '@/pages/metrics/MetricsPage';

function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route index element={<Navigate to="/auth/login" replace />} />
      </Route>

      {/* Rotas protegidas */}
      <Route
        path="/"
        element={
          <AuthGuard>
            <MainLayout />
          </AuthGuard>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="kanban" element={<KanbanPage />} />
        <Route path="tasks/new" element={<TaskFormPage />} />
        <Route path="tasks/:id/edit" element={<TaskFormPage />} />
        <Route
          path="users/new"
          element={
            <RoleGuard role="admin">
              <UserFormPage />
            </RoleGuard>
          }
        />
        <Route
          path="metrics"
          element={
            <RoleGuard role="admin">
              <MetricsPage />
            </RoleGuard>
          }
        />
      </Route>

      {/* Rota 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;

