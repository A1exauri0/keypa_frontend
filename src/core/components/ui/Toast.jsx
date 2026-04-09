import { Icon } from '@iconify/react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

const variantStyles = {
  success: {
    container: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    icon: 'mdi:check-circle',
    iconClass: 'text-emerald-600',
  },
  danger: {
    container: 'border-rose-200 bg-rose-50 text-rose-900',
    icon: 'mdi:alert-circle',
    iconClass: 'text-rose-600',
  },
  warning: {
    container: 'border-amber-200 bg-amber-50 text-amber-900',
    icon: 'mdi:alert',
    iconClass: 'text-amber-600',
  },
  info: {
    container: 'border-violet-200 bg-violet-50 text-violet-900',
    icon: 'mdi:information',
    iconClass: 'text-violet-600',
  },
};

function ToastViewport({ toasts, dismissToast }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] grid w-[min(92vw,24rem)] gap-2">
      {toasts.map((toast) => {
        const style = variantStyles[toast.variant] || variantStyles.info;

        return (
          <article
            key={toast.id}
            className={`pointer-events-auto rounded-xl border px-3 py-2 shadow-lg backdrop-blur transition-all duration-200 ${
              toast.closing ? 'opacity-0 -translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'
            } ${style.container}`}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-2">
              <Icon icon={style.icon} width="20" className={style.iconClass} />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{toast.title}</p>
                {toast.message ? <p className="mt-0.5 text-xs opacity-90">{toast.message}</p> : null}
              </div>

              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="rounded p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100"
                aria-label="Cerrar notificacion"
              >
                <Icon icon="mdi:close" width="16" />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.map((item) => (item.id === id ? { ...item, closing: true } : item)));

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 200);
  }, []);

  const toast = useCallback(
    ({ title, message = '', variant = 'info', duration = 3000 }) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, title, message, variant, closing: false }]);

      if (duration > 0) {
        window.setTimeout(() => dismissToast(id), duration);
      }
    },
    [dismissToast],
  );

  const contextValue = useMemo(
    () => ({
      toast,
      dismissToast,
    }),
    [toast, dismissToast],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastViewport toasts={toasts} dismissToast={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }

  return context;
}
