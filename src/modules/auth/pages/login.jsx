import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
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
        message: "Tu sesion ha iniciado correctamente.",
        variant: "success",
      });
      navigate("/admin/dashboard", { replace: true });
    } catch (apiError) {
      const message =
        apiError.response?.data?.message || "No se pudo iniciar sesion";
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
    <main className="min-h-screen grid place-items-center bg-gradient-to-br from-fuchsia-900 via-violet-900 to-purple-900 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl shadow-slate-900/25">

        <h1 className="mb-1 text-3xl font-bold text-slate-900">
          Iniciar sesion
        </h1>
        <p className="mb-5 text-sm text-slate-500">
          Ingresa con tu cuenta para entrar al panel.
        </p>

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

          {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
        </form>
      </section>
    </main>
  );
}
