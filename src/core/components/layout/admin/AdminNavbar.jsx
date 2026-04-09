import { Icon } from "@iconify/react";
import Button from "../../ui/Button";

export default function AdminNavbar({
  usuario,
  onToggleSidebar,
  onToggleMobile,
  onLogout,
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-fuchsia-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleMobile}
            className="grid h-10 w-10 place-items-center rounded-lg border border-fuchsia-200 text-fuchsia-800 hover:bg-fuchsia-50 md:hidden"
            aria-label="Abrir menu"
          >
            <Icon icon="mdi:menu" width="20" />
          </button>

          <button
            type="button"
            onClick={onToggleSidebar}
            className="hidden h-10 items-center gap-2 rounded-lg border border-fuchsia-200 px-3 text-sm text-fuchsia-800 hover:bg-fuchsia-50 md:inline-flex"
          >
            <Icon icon="mdi:menu" width="18" />
          </button>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Panel administrativo
            </p>
            <h1 className="text-xl font-bold leading-tight text-slate-900">
              Admin
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-xs text-slate-500">Usuario activo</p>
            <p className="text-sm font-semibold text-slate-900">
              {usuario?.nombre || "Usuario"}
            </p>
          </div>

          <Button variant="danger" size="sm" onClick={onLogout}>
            <Icon icon="mdi:logout" width="16" />
            Salir
          </Button>
        </div>
      </div>
    </header>
  );
}
