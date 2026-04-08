import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { TOKEN_KEY } from '../core/api/http';
import { loginUsuario, logoutUsuario, meUsuario } from '../modules/usuarios/services/usuarioService';

const AuthContext = createContext(null);

function tokenExpirado(token) {
  try {
    const decoded = jwtDecode(token);
    if (!decoded?.exp) {
      return true;
    }

    return decoded.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cerrarSesionLocal = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUsuario(null);
  }, []);

  const iniciarSesion = useCallback(async (credenciales) => {
    const data = await loginUsuario(credenciales);

    localStorage.setItem(TOKEN_KEY, data.token);
    setUsuario(data.user);

    return data.user;
  }, []);

  const cerrarSesion = useCallback(async () => {
    try {
      await logoutUsuario();
    } finally {
      cerrarSesionLocal();
    }
  }, [cerrarSesionLocal]);

  const cargarSesion = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token || tokenExpirado(token)) {
      cerrarSesionLocal();
      setCargando(false);
      return;
    }

    try {
      const data = await meUsuario();
      setUsuario(data.user);
    } catch {
      cerrarSesionLocal();
    } finally {
      setCargando(false);
    }
  }, [cerrarSesionLocal]);

  useEffect(() => {
    cargarSesion();
  }, [cargarSesion]);

  const value = useMemo(
    () => ({
      usuario,
      cargando,
      autenticado: Boolean(usuario),
      iniciarSesion,
      cerrarSesion,
    }),
    [usuario, cargando, iniciarSesion, cerrarSesion],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}
