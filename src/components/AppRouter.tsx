import { useRoutes, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/lib/authStore';
import HomePage from '@/pages/HomePage';
import CursosPage from '@/pages/CursosPage';
import CourseDetailPage from '@/pages/CourseDetailPage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminCoursesPage from '@/pages/admin/courses/AdminCoursesPage';
import AdminCourseDetailPage from '@/pages/admin/courses/AdminCourseDetailPage';
import AdminModuleDetailPage from '@/pages/admin/courses/AdminModuleDetailPage';
import AdminUsersPage from '@/pages/admin/users/AdminUsersPage';
import AdminInvitePage from '@/pages/admin/users/AdminInvitePage';
const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
const AdminRoute = () => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/dashboard" replace />;
};
export default function AppRouter() {
  const routes = useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/cursos', element: <CursosPage /> },
    { path: '/cursos/:courseId', element: <CourseDetailPage /> },
    { path: '/login', element: <LoginPage /> },
    {
      element: <ProtectedRoute />,
      children: [
        { path: '/dashboard', element: <DashboardPage /> },
      ],
    },
    {
      path: '/admin',
      element: <AdminRoute />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            { index: true, element: <AdminDashboardPage /> },
            { path: 'gerenciar-cursos', element: <AdminCoursesPage /> },
            { path: 'gerenciar-cursos/:courseId', element: <AdminCourseDetailPage /> },
            { path: 'gerenciar-cursos/:courseId/:moduleId', element: <AdminModuleDetailPage /> },
            { path: 'gerenciar-acessos', element: <AdminUsersPage /> },
            { path: 'convidar-usuarios', element: <AdminInvitePage /> },
          ],
        },
      ],
    },
    { path: '*', element: <Navigate to="/" replace /> },
  ]);
  return routes;
}