import { Icon } from '@iconify/react';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const LINKS_INDIVIDUALES = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'mdi:view-dashboard-outline' },
  { to: '/admin/clientes', label: 'Clientes', icon: 'mdi:account-multiple-outline' },
];

const MENUS_GRUPO = [
  {
    key: 'catalogo',
    label: 'Catalogo',
    icon: 'mdi:book-open-page-variant-outline',
    items: [
      { to: '/admin/productos', label: 'Productos', icon: 'mdi:package-variant-closed' },
      { to: '/admin/marcas', label: 'Marcas', icon: 'mdi:tag-multiple-outline' },
      { to: '/admin/categorias', label: 'Categorias', icon: 'mdi:shape-outline' },
    ],
  },
  {
    key: 'ubicaciones',
    label: 'Ubicaciones',
    icon: 'mdi:map-marker-multiple-outline',
    items: [
      { to: '/admin/ciudades', label: 'Ciudades', icon: 'mdi:city-variant-outline' },
      { to: '/admin/colonias', label: 'Colonias', icon: 'mdi:map-marker-radius-outline' },
    ],
  },
  {
    key: 'infraestructura',
    label: 'Sucursales y almacenes',
    icon: 'mdi:warehouse',
    items: [
      { to: '/admin/sucursales', label: 'Sucursales', icon: 'mdi:store-marker-outline' },
      { to: '/admin/almacenes', label: 'Almacenes', icon: 'mdi:warehouse' },
    ],
  },
  {
    key: 'inventarios',
    label: 'Inventarios',
    icon: 'mdi:clipboard-list-outline',
    items: [
      { to: '/admin/inventarios', label: 'Inventarios', icon: 'mdi:clipboard-list-outline' },
    ],
  },
];

export default function AdminSidebar({ expanded, mobileOpen, onCloseMobile, onNavigateStart, logoSrc }) {
  const location = useLocation();
  const [logoError, setLogoError] = useState(false);
  const [menusAbiertos, setMenusAbiertos] = useState(() =>
    MENUS_GRUPO.reduce((acc, grupo) => {
      acc[grupo.key] = true;
      return acc;
    }, {}),
  );

  const gruposActivos = useMemo(
    () =>
      MENUS_GRUPO.reduce((acc, grupo) => {
        acc[grupo.key] = grupo.items.some((item) => location.pathname.startsWith(item.to));
        return acc;
      }, {}),
    [location.pathname],
  );

  useEffect(() => {
    setMenusAbiertos((prev) => {
      const next = { ...prev };
      let changed = false;

      for (const grupo of MENUS_GRUPO) {
        if (gruposActivos[grupo.key] && !next[grupo.key]) {
          next[grupo.key] = true;
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [gruposActivos]);

  const opcionesCompactas = useMemo(
    () => [...LINKS_INDIVIDUALES, ...MENUS_GRUPO.flatMap((grupo) => grupo.items)],
    [],
  );

  const handleItemClick = () => {
    if (onNavigateStart) {
      onNavigateStart();
    }

    onCloseMobile?.();
  };

  const toggleMenu = (key) => {
    setMenusAbiertos((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderLinkPrincipal = (item) => (
    <li key={item.to}>
      <NavLink
        to={item.to}
        onClick={handleItemClick}
        title={expanded ? undefined : item.label}
        className={({ isActive }) =>
          `flex items-center rounded-xl text-sm font-medium transition ${
            expanded ? 'h-11 gap-3 px-3' : 'mx-auto h-11 w-11 justify-center px-0'
          } ${isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`
        }
      >
        <Icon icon={item.icon} width="20" />
        {expanded ? <span>{item.label}</span> : null}
      </NavLink>
    </li>
  );

  const renderGrupo = (grupo) => (
    <li key={grupo.key}>
      <button
        type="button"
        onClick={() => toggleMenu(grupo.key)}
        className={`mt-2 flex h-11 w-full items-center justify-between rounded-xl px-3 text-sm font-medium transition ${
          gruposActivos[grupo.key]
            ? 'bg-white/20 text-white'
            : 'text-white/80 hover:bg-white/10 hover:text-white'
        }`}
      >
        <span className="flex items-center gap-3">
          <Icon icon={grupo.icon} width="20" />
          {grupo.label}
        </span>
        <Icon icon={menusAbiertos[grupo.key] ? 'mdi:chevron-up' : 'mdi:chevron-down'} width="18" />
      </button>

      {menusAbiertos[grupo.key] ? (
        <ul className="mt-1 grid gap-1 pl-2">
          {grupo.items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={handleItemClick}
                className={({ isActive }) =>
                  `flex h-10 items-center gap-2 rounded-lg px-3 text-sm transition ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon icon={item.icon} width="18" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-slate-950/40 md:hidden"
          aria-label="Cerrar menu"
        />
      ) : null}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-violet-950 via-fuchsia-900 to-rose-900 text-slate-100 shadow-xl transition-all duration-300 md:relative md:z-auto ${
          expanded ? 'w-72' : 'w-20'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div
          className={`flex h-16 items-center border-b border-white/10 ${
            expanded ? 'px-4' : 'justify-center px-0'
          }`}
        >
          <div className={`flex items-center overflow-hidden ${expanded ? 'gap-2' : 'justify-center'}`}>
            <span
              className={`grid place-items-center rounded-lg bg-white/20 text-white overflow-hidden ${
                expanded ? 'h-9 w-9' : 'h-11 w-11'
              }`}
            >
              {logoError ? (
                <Icon icon="mdi:storefront-outline" width="20" />
              ) : (
                <img
                  src={logoSrc}
                  alt="Keypa"
                  className="h-7 w-7 object-contain"
                  onError={() => setLogoError(true)}
                />
              )}
            </span>
            {expanded ? <strong className="truncate text-sm">Keypa Outlet</strong> : null}
          </div>
        </div>

        <nav className={`${expanded ? 'p-3' : 'px-0 py-3'}`}>
          <ul className="grid gap-1">
            {LINKS_INDIVIDUALES.map(renderLinkPrincipal)}
            {expanded
              ? MENUS_GRUPO.map(renderGrupo)
              : opcionesCompactas.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={handleItemClick}
                      title={item.label}
                      className={({ isActive }) =>
                        `mx-auto flex h-11 w-11 items-center justify-center rounded-xl text-sm font-medium transition ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`
                      }
                    >
                      <Icon icon={item.icon} width="20" />
                    </NavLink>
                  </li>
                ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
