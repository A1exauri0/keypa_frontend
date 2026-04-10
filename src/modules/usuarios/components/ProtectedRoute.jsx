import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { autenticado, cargando } = useAuth();

  if (cargando) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
        <p className="rounded-lg bg-white px-4 py-3 text-slate-700 shadow">Cargando sesión...</p>
      </main>
    );
  }

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
