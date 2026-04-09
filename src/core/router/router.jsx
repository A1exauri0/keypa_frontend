import { Navigate, createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../../modules/usuarios/components/ProtectedRoute';
import LoginPage from '../../modules/auth/pages/login';
import LayoutAdmin from '../layouts/LayoutAdmin';
import DashboardPage from '../../modules/dashboard/pages/dashboard';
import ProductosPage from '../../modules/dashboard/pages/productos';

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
