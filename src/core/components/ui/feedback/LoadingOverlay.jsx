import { Icon } from '@iconify/react';
import { useState } from 'react';

export default function LoadingOverlay({
  show,
  message = 'Cargando...',
  logoSrc,
  logoAlt = 'Logo',
}) {
  const [logoError, setLogoError] = useState(false);
  const shouldShowLogo = Boolean(logoSrc) && !logoError;

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-black/35 backdrop-blur-sm">
      <div className="grid justify-items-center gap-3 rounded-2xl bg-white/90 px-6 py-5 shadow-2xl">
        <div className="relative grid h-16 w-16 place-items-center">
          <div className="absolute inset-0 rounded-full border-4 border-fuchsia-200" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-fuchsia-600 border-r-violet-500" />

          {shouldShowLogo ? (
            <img
              src={logoSrc}
              alt={logoAlt}
              className="h-8 w-8 rounded-md object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <Icon icon="mdi:storefront-outline" width="20" className="text-fuchsia-700" />
          )}
        </div>

        <p className="text-sm font-medium text-slate-700">{message}</p>
      </div>
    </div>
  );
}
