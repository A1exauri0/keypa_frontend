import { Icon } from '@iconify/react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'mdi:view-dashboard-outline' },
  { to: '/admin/productos', label: 'Productos', icon: 'mdi:package-variant-closed' },
];

export default function AdminSidebar({ expanded, mobileOpen, onCloseMobile, onNavigateStart, logoSrc }) {
  const [logoError, setLogoError] = useState(false);

  const handleItemClick = () => {
    if (onNavigateStart) {
      onNavigateStart();
    }

    onCloseMobile();
  };

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
            {items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={handleItemClick}
                  title={expanded ? undefined : item.label}
                  className={({ isActive }) =>
                    `flex items-center rounded-xl text-sm font-medium transition ${
                      expanded ? 'h-11 gap-3 px-3' : 'mx-auto h-11 w-11 justify-center px-0'
                    } ${
                      isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon icon={item.icon} width="20" />
                  {expanded ? <span>{item.label}</span> : null}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
