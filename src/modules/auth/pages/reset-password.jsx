import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import LayoutAuth from '../../../core/layouts/LayoutAuth';
import InputText from '../../../core/components/ui/inputs/InputText';
import Button from '../../../core/components/ui/buttons/Button';
import { useToast } from '../../../core/components/ui/feedback/Toast';
import { restablecerPassword } from '../services/passwordRecoveryService';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enlaceValido = useMemo(() => Boolean(token && email), [token, email]);

  const enviarFormulario = async (event) => {
    event.preventDefault();

    if (!enlaceValido) {
      setError('El enlace no es valido. Solicita una nueva recuperacion.');
      return;
    }

    setError('');
    setEnviando(true);

    try {
      const response = await restablecerPassword({
        email,
        token,
        password,
        confirmPassword,
      });

      toast({
        title: 'Contrasena actualizada',
        message: response?.message || 'Ya puedes iniciar sesión con tu nueva contrasena.',
        variant: 'success',
      });

      navigate('/login', { replace: true });
    } catch (apiError) {
      const message = apiError.response?.data?.message || 'No fue posible restablecer la contrasena';
      setError(message);
      toast({
        title: 'No se pudo completar',
        message,
        variant: 'danger',
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <LayoutAuth
      title="Nueva contrasena"
      description="Escribe tu nueva contrasena para recuperar el acceso."
    >
        {!enlaceValido ? (
          <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            Enlace incompleto o invalido. Solicita nuevamente la recuperacion.
          </p>
        ) : null}

        <form onSubmit={enviarFormulario} className="space-y-3">
          <InputText
            id="reset-password"
            label="Nueva contrasena"
            type="password"
            value={password}
            onChange={setPassword}
            required
            autoComplete="new-password"
            placeholder="Minimo 8 caracteres"
            allowSpecialChars
          />

          <InputText
            id="reset-confirm-password"
            label="Confirmar contrasena"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
            autoComplete="new-password"
            placeholder="Repite la nueva contrasena"
            allowSpecialChars
          />

          <Button className="mt-2" fullWidth disabled={enviando || !enlaceValido} type="submit">
            {enviando ? 'Actualizando...' : 'Guardar nueva contrasena'}
          </Button>

          {error ? <p className="text-sm text-red-700">{error}</p> : null}

          <p className="text-sm text-slate-600">
            <Link to="/login" className="font-semibold text-violet-700 hover:text-violet-800">
              Volver a iniciar sesión
            </Link>
          </p>
        </form>
    </LayoutAuth>
  );
}
