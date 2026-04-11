import Modal from '../../../core/components/ui/overlays/Modal';
import Button from '../../../core/components/ui/buttons/Button';

function formatearMoneda(valor) {
  const numero = Number(valor || 0);
  return `$${numero.toFixed(2)}`;
}

function etiquetaEstado(estado) {
  if (estado === 'pagado') {
    return 'Pagado';
  }

  if (estado === 'cancelado') {
    return 'Cancelado';
  }

  return 'Pendiente';
}

export default function VentaDetalleModal({ open, venta, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Detalle de venta"
      widthClass="max-w-4xl"
      footer={
        <div className="flex justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      }
    >
      <div className="grid gap-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="grid gap-2 text-sm md:grid-cols-2">
            <p className="text-slate-700">
              <strong>Folio:</strong> {venta?.folio || '-'}
            </p>
            <p className="text-slate-700">
              <strong>Estado:</strong> {etiquetaEstado(venta?.estado)}
            </p>
            <p className="text-slate-700">
              <strong>Cliente:</strong> {venta?.cliente?.nombre || '-'} {venta?.cliente?.apellidos || ''}
            </p>
            <p className="text-slate-700">
              <strong>Almacen:</strong> {venta?.almacen?.nombre || '-'}
            </p>
            <p className="text-slate-700">
              <strong>Vendedor:</strong> {venta?.usuario?.nombre || '-'}
            </p>
            <p className="text-slate-700">
              <strong>Pago:</strong> {venta?.tipoPago === 'efectivo' ? 'Efectivo' : 'Transferencia'}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <div className="grid gap-2 text-sm md:grid-cols-2">
            <p className="text-emerald-900">
              <strong>Monto pagado:</strong> {formatearMoneda(venta?.montoPagado)}
            </p>
            <p className="text-emerald-900">
              <strong>Cambio:</strong> {formatearMoneda(venta?.cambio)}
            </p>
          </div>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="py-2 pr-3">Producto</th>
                <th className="py-2 pr-3">SKU</th>
                <th className="py-2 pr-3">Cantidad</th>
                <th className="py-2 pr-3">Precio</th>
                <th className="py-2 pr-3">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {(venta?.detalles || []).map((item) => (
                <tr key={item.idVentaDetalle} className="border-b border-slate-100">
                  <td className="py-2 pr-3 text-slate-700">{item.producto?.nombre || '-'}</td>
                  <td className="py-2 pr-3 text-slate-700">{item.producto?.sku || '-'}</td>
                  <td className="py-2 pr-3 text-slate-700">{item.cantidad}</td>
                  <td className="py-2 pr-3 text-slate-700">{formatearMoneda(item.precioUnitario)}</td>
                  <td className="py-2 pr-3 text-slate-700">{formatearMoneda(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-2 md:hidden">
          {(venta?.detalles || []).map((item) => (
            <div key={item.idVentaDetalle} className="rounded-xl border border-slate-200 p-3">
              <p className="text-sm font-semibold text-slate-800">{item.producto?.nombre || '-'}</p>
              <p className="text-sm text-slate-600">SKU: {item.producto?.sku || '-'}</p>
              <div className="mt-1 grid grid-cols-3 gap-2 text-sm">
                <p className="text-slate-700">Cant: {item.cantidad}</p>
                <p className="text-slate-700">Precio: {formatearMoneda(item.precioUnitario)}</p>
                <p className="text-slate-700">Sub: {formatearMoneda(item.subtotal)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end rounded-xl bg-slate-100 px-3 py-2">
          <strong className="text-base text-slate-900">Total: {formatearMoneda(venta?.total)}</strong>
        </div>
      </div>
    </Modal>
  );
}
