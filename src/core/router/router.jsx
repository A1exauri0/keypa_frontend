import { Navigate, createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../../modules/usuarios/components/ProtectedRoute';
import LoginPage from '../../modules/auth/pages/login';
import ForgotPasswordPage from '../../modules/auth/pages/forgot-password';
import ResetPasswordPage from '../../modules/auth/pages/reset-password';
import LayoutAdmin from '../layouts/LayoutAdmin';
import DashboardPage from '../../modules/dashboard/pages/dashboard';
import ProductosPage from '../../modules/productos/pages/productos';
import MarcasPage from '../../modules/productos/pages/marcas';
import CategoriasPage from '../../modules/productos/pages/categorias';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/admin/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <LayoutAdmin />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'productos',
        element: <ProductosPage />,
      },
      {
        path: 'marcas',
        element: <MarcasPage />,
      },
      {
        path: 'categorias',
        element: <CategoriasPage />,
      },
    ],
  },
  {
    path: '/inicio',
    element: <Navigate to="/admin/dashboard" replace />,
  },
  {
    path: '/dashboard',
    element: <Navigate to="/admin/dashboard" replace />,
  },
  {
    path: '/actividad',
    element: <Navigate to="/admin/productos" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/admin/dashboard" replace />,
  },
]);
