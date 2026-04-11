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
import CiudadesPage from '../../modules/ubicaciones/pages/ciudades';
import ColoniasPage from '../../modules/ubicaciones/pages/colonias';
import ClientesPage from '../../modules/clientes/pages/clientes';
import SucursalesPage from '../../modules/sucursales/pages/sucursales';
import AlmacenesPage from '../../modules/almacenes/pages/almacenes';
import InventariosPage from '../../modules/inventarios/pages/inventarios';

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
      {
        path: 'ciudades',
        element: <CiudadesPage />,
      },
      {
        path: 'colonias',
        element: <ColoniasPage />,
      },
      {
        path: 'clientes',
        element: <ClientesPage />,
      },
      {
        path: 'sucursales',
        element: <SucursalesPage />,
      },
      {
        path: 'almacenes',
        element: <AlmacenesPage />,
      },
      {
        path: 'inventarios',
        element: <InventariosPage />,
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
