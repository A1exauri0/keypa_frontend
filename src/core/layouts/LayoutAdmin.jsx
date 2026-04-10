import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../components/layout/admin/AdminSidebar';
import AdminNavbar from '../components/layout/admin/AdminNavbar';
import { useToast } from '../components/ui/feedback/Toast';
import LoadingOverlay from '../components/ui/feedback/LoadingOverlay';

export default function LayoutAdmin() {
  const appLogo = '/images/logos/logo.png';
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, cerrarSesion } = useAuth();
  const { toast } = useToast();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const [navegandoVista, setNavegandoVista] = useState(false);

  useEffect(() => {
    if (!navegandoVista) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setNavegandoVista(false);
    }, 220);

    return () => window.clearTimeout(timer);
  }, [location.pathname, navegandoVista]);

  const handleRouteChangeStart = () => {
    setNavegandoVista(true);
  };

  const handleLogout = async () => {
    const nombreUsuario = usuario?.nombre || 'Usuario';
    try {
      setCerrandoSesion(true);
      await cerrarSesion();
      toast({
        title: `Hasta pronto, ${nombreUsuario}`,
        message: 'Sesion cerrada correctamente.',
        variant: 'warning',
      });
      navigate('/login', { replace: true });
    } finally {
      setCerrandoSesion(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-fuchsia-50 to-violet-100 text-slate-900">
      <LoadingOverlay
        show={cerrandoSesion || navegandoVista}
        message={cerrandoSesion ? 'Cerrando sesión...' : 'Cargando vista...'}
        logoSrc={appLogo}
        logoAlt="Keypa"
      />

      <div className="flex min-h-screen">
        <AdminSidebar
          expanded={sidebarExpanded}
          mobileOpen={sidebarMobileOpen}
          onCloseMobile={() => setSidebarMobileOpen(false)}
          onNavigateStart={handleRouteChangeStart}
          logoSrc={appLogo}
        />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <AdminNavbar
            usuario={usuario}
            onToggleSidebar={() => setSidebarExpanded((prev) => !prev)}
            onToggleMobile={() => setSidebarMobileOpen((prev) => !prev)}
            onLogout={handleLogout}
          />

          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
