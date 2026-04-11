import { Icon } from '@iconify/react';
import Modal from '../../../core/components/ui/overlays/Modal';
import Button from '../../../core/components/ui/buttons/Button';

function formatearMoneda(valor) {
  const numero = Number(valor || 0);
  return `$${numero.toFixed(2)}`;
}

export default function VentaExitosaModal({ open, venta, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Venta exitosa"
      widthClass="max-w-md"
      footer={
        <div className="flex justify-end">
          <Button type="button" onClick={onClose}>
            Entendido
          </Button>
        </div>
      }
    >
<div className="grid gap-5 text-center">
  {/* Icono */}
  <div className="flex justify-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
      <Icon
        icon="line-md:circle-twotone-to-confirm-circle-transition"
        width="64"
        className="text-emerald-600"
      />
    </div>
  </div>

  {/* Texto principal */}
  <div className="space-y-1">
    <p className="text-xl font-semibold text-slate-900">
      Venta completada
    </p>
    <p className="text-sm text-slate-500">
      Folio: <span className="font-medium text-slate-700">{venta?.folio || '-'}</span>
    </p>
  </div>

  {/* Card de resumen */}
  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left shadow-sm">
    <div className="space-y-2 text-sm text-emerald-900">
      <div className="flex justify-between">
        <span>Total</span>
        <span className="font-medium">{formatearMoneda(venta?.total)}</span>
      </div>

      <div className="flex justify-between">
        <span>Pagado</span>
        <span className="font-medium">{formatearMoneda(venta?.montoPagado)}</span>
      </div>

      <div className="mt-2 border-t border-emerald-200 pt-2 flex justify-between text-base font-semibold">
        <span>Cambio</span>
        <span>{formatearMoneda(venta?.cambio)}</span>
      </div>
    </div>
  </div>
</div>
    </Modal>
  );
}
