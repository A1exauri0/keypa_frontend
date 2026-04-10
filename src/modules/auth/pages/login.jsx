import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import LayoutAuth from "../../../core/layouts/LayoutAuth";
import InputText from "../../../core/components/ui/inputs/InputText";
import Button from "../../../core/components/ui/buttons/Button";
import { useToast } from "../../../core/components/ui/feedback/Toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleEmailChange = (nextValue) => {
    const cleanEmail = nextValue.replace(/[^a-zA-Z0-9@._-]/g, "");
    setEmail(cleanEmail);
  };

  const enviarFormulario = async (event) => {
    event.preventDefault();
    setError("");
    setEnviando(true);

    try {
      const usuario = await iniciarSesion({ email, password });

      toast({
        title: `Bienvenida, ${usuario?.nombre || "Usuario"}`,
        message: "Tu sesión ha iniciado correctamente.",
        variant: "success",
      });
      navigate("/admin/dashboard", { replace: true });
    } catch (apiError) {
      const message =
        apiError.response?.data?.message || "No se pudo iniciar sesin";
      setError(message);
      toast({
        title: "Error de acceso",
        message,
        variant: "danger",
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <LayoutAuth
      title="Iniciar sesión"
      description="Ingresa con tu cuenta para entrar al panel."
    >
        <form onSubmit={enviarFormulario}>
          <div className="mb-3">
            <InputText
              id="email"
              label="Correo"
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              autoComplete="email"
              placeholder="correo@dominio.com"
            />
          </div>

          <div className="mb-3">
            <InputText
              id="password"
              label="Contrasena"
              type="password"
              value={password}
              onChange={setPassword}
              required
              autoComplete="current-password"
              placeholder="Ingresa tu contrasena"
              allowSpecialChars
            />
          </div>

          <Button className="mt-2" fullWidth disabled={enviando} type="submit">
            Entrar
          </Button>

          <p className="mt-3 text-sm text-slate-600">
            <Link to="/forgot-password" className="font-semibold text-violet-700 hover:text-violet-800">
              ¿Olvidaste tu contrasena?
            </Link>
          </p>

          {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
        </form>
    </LayoutAuth>
  );
}
