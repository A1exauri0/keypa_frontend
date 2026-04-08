import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../../../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviarFormulario = async (event) => {
    event.preventDefault();
    setError('');
    setEnviando(true);

    try {
      await iniciarSesion({ email, password });
      navigate('/inicio', { replace: true });
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'No se pudo iniciar sesion');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl shadow-slate-900/25">
        <div className="mb-3 flex items-center gap-2 text-blue-700">
          <Icon icon="mdi:shield-account" width="24" />
          <strong>Acceso de usuarios</strong>
        </div>
        <h1 className="mb-1 text-3xl font-bold text-slate-900">Iniciar sesion</h1>
        <p className="mb-5 text-sm text-slate-500">Ingresa con tu cuenta para entrar al panel.</p>

        <form onSubmit={enviarFormulario}>
          <div className="mb-3 grid gap-1.5">
            <label className="text-sm text-slate-700" htmlFor="email">
              Correo
            </label>
            <input
              id="email"
              type="email"
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 grid gap-1.5">
            <label className="text-sm text-slate-700" htmlFor="password">
              Contrasena
            </label>
            <input
              id="password"
              type="password"
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="mt-2 w-full rounded-xl bg-blue-700 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={enviando}
            type="submit"
          >
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>

          {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
        </form>
      </section>
    </main>
  );
}
