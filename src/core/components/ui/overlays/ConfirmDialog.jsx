import Button from '../buttons/Button';

export default function ConfirmDialog({
  open,
  title = 'Confirmar accion',
  message = 'Estas seguro que deseas continuar?',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  confirmVariant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[130] grid place-items-center bg-slate-950/45 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{message}</p>

        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button type="button" variant={confirmVariant} onClick={onConfirm} disabled={loading}>
            {loading ? 'Procesando...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
