import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from './guards/AuthGuard';
import { PermissionGuard } from './guards/PermissionGuard';
import { DASHBOARD_PERMISSIONS, USER_PERMISSIONS } from '@/constants/permissions';

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
        <Route
          index
          element={
            <PermissionGuard permission={DASHBOARD_PERMISSIONS.VIEW}>
              <Navigate to="/dashboard" replace />
            </PermissionGuard>
          }
        />
        <Route
          path="dashboard"
          element={
            <PermissionGuard permission={DASHBOARD_PERMISSIONS.VIEW}>
              <DashboardPage />
            </PermissionGuard>
          }
        />
        <Route
          path="kanban"
          element={
            <PermissionGuard permission="TASKS_LIST">
              <KanbanPage />
            </PermissionGuard>
          }
        />
        <Route
          path="tasks/new"
          element={
            <PermissionGuard permission="TASKS_CREATE">
              <TaskFormPage />
            </PermissionGuard>
          }
        />
        <Route
          path="tasks/:id/edit"
          element={
            <PermissionGuard permission="TASKS_UPDATE">
              <TaskFormPage />
            </PermissionGuard>
          }
        />
        <Route
          path="users/new"
          element={
            <PermissionGuard permission={USER_PERMISSIONS.CREATE}>
              <UserFormPage />
            </PermissionGuard>
          }
        />
        <Route
          path="metrics"
          element={
            <PermissionGuard permission={DASHBOARD_PERMISSIONS.METRICS}>
              <MetricsPage />
            </PermissionGuard>
          }
        />
      </Route>

      {/* Rota 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;

