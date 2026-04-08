import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';

export default function InicioPage() {
  const navigate = useNavigate();
  const { usuario, cerrarSesion } = useAuth();

  const salir = async () => {
    await cerrarSesion();
    navigate('/login', { replace: true });
  };

  return (
    <main className="min-h-screen grid place-items-center bg-slate-100 px-4">
      <section className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-slate-900">Inicio</h1>
          <button
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            onClick={salir}
            type="button"
          >
            Cerrar sesion
          </button>
        </div>

        <p className="text-slate-700">Logueado: {usuario?.nombre || 'Usuario'}</p>
      </section>
    </main>
  );
}
