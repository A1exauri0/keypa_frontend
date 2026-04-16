import { Icon } from '@iconify/react';

export default function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  widthClass = 'max-w-3xl',
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 p-2 sm:p-4">
      <div
        className={`relative mx-auto my-4 w-full ${widthClass} overflow-visible rounded-2xl bg-white shadow-2xl`}
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <Icon icon="material-symbols:close" />
          </button>
        </header>

        <div className="relative z-20 overflow-visible p-4 sm:p-5">{children}</div>

        {footer ? <footer className="relative z-10 border-t border-slate-200 px-5 py-4">{footer}</footer> : null}
      </div>
    </div>
  );
}
