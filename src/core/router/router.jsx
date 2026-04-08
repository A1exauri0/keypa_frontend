import { Navigate, createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../../modules/usuarios/components/ProtectedRoute';
import LoginPage from '../../modules/usuarios/pages/Login/LoginPage';
import InicioPage from '../../modules/usuarios/pages/Inicio/InicioPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/inicio" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/inicio',
    element: (
      <ProtectedRoute>
        <InicioPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/inicio" replace />,
  },
]);
