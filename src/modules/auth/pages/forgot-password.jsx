import { useState } from 'react';
import { Link } from 'react-router-dom';
import LayoutAuth from '../../../core/layouts/LayoutAuth';
import InputText from '../../../core/components/ui/inputs/InputText';
import Button from '../../../core/components/ui/buttons/Button';
import { useToast } from '../../../core/components/ui/feedback/Toast';
import { solicitarRecuperacionPassword } from '../services/passwordRecoveryService';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const enviarSolicitud = async (event) => {
    event.preventDefault();
    setError('');
    setEnviando(true);

    try {
      const response = await solicitarRecuperacionPassword({ email });
      setEnviado(true);

      toast({
        title: 'Solicitud enviada',
        message: response?.message || 'Revisa tu correo para continuar.',
        variant: 'success',
      });
    } catch (apiError) {
      const message = apiError.response?.data?.message || 'No fue posible enviar el enlace de recuperacion';
      setError(message);
      toast({
        title: 'No se pudo enviar',
        message,
        variant: 'danger',
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <LayoutAuth
      title="Recuperar contrasena"
      description="Ingresa tu correo y te enviaremos un enlace para crear una nueva contrasena."
    >
        <form onSubmit={enviarSolicitud} className="space-y-3">
          <InputText
            id="forgot-email"
            label="Correo"
            type="email"
            value={email}
            onChange={setEmail}
            required
            autoComplete="email"
            placeholder="correo@dominio.com"
          />

          <Button className="mt-2" fullWidth disabled={enviando || enviado} type="submit">
            {enviando ? 'Enviando...' : enviado ? 'Enlace enviado' : 'Enviar enlace'}
          </Button>

          {error ? <p className="text-sm text-red-700">{error}</p> : null}

          <p className="text-sm text-slate-600">
            ¿Recordaste tu contrasena?{' '}
            <Link to="/login" className="font-semibold text-violet-700 hover:text-violet-800">
              Volver a iniciar sesión
            </Link>
          </p>
        </form>
    </LayoutAuth>
  );
}
