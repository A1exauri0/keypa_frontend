import Modal from '../../../core/components/ui/overlays/Modal';
import Button from '../../../core/components/ui/buttons/Button';

function formatearMoneda(valor) {
  const numero = Number(valor || 0);
  return `$${numero.toFixed(2)}`;
}

export default function CompraDetalleModal({ open, compra, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Detalle de compra"
      widthClass="max-w-4xl"
      footer={
        <div className="flex justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      }
    >
      {!compra ? <p className="text-sm text-slate-500">No hay informacion disponible.</p> : null}

      {compra ? (
        <section className="grid gap-4">
          <div className="grid gap-2 rounded-xl border border-slate-200 p-3 md:grid-cols-2">
            <p className="text-sm text-slate-700"><strong>Folio:</strong> {compra.folio}</p>
            <p className="text-sm text-slate-700"><strong>Estado:</strong> {compra.estado}</p>
            <p className="text-sm text-slate-700"><strong>Proveedor:</strong> {compra.proveedor?.nombre || '-'}</p>
            <p className="text-sm text-slate-700"><strong>Almacen:</strong> {compra.almacen?.nombre || '-'}</p>
            <p className="text-sm text-slate-700"><strong>Registrada por:</strong> {compra.usuario?.nombre || '-'}</p>
            <p className="text-sm text-slate-700"><strong>Fecha:</strong> {new Date(compra.createdAt).toLocaleString()}</p>
            <p className="text-sm text-slate-700 md:col-span-2"><strong>Observaciones:</strong> {compra.observaciones || '-'}</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
                  <th className="px-3 py-2">Producto</th>
                  <th className="px-3 py-2">SKU</th>
                  <th className="px-3 py-2">Cantidad</th>
                  <th className="px-3 py-2">Costo unitario</th>
                  <th className="px-3 py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(compra.detalles || []).map((item) => (
                  <tr key={item.idCompraDetalle} className="border-b border-slate-100">
                    <td className="px-3 py-2 text-slate-700">{item.producto?.nombre || '-'}</td>
                    <td className="px-3 py-2 text-slate-700">{item.producto?.sku || '-'}</td>
                    <td className="px-3 py-2 text-slate-700">{item.cantidad}</td>
                    <td className="px-3 py-2 text-slate-700">{formatearMoneda(item.costoUnitario)}</td>
                    <td className="px-3 py-2 text-slate-700">{formatearMoneda(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2">
            <p className="text-sm text-slate-600">Total</p>
            <strong className="text-base text-slate-900">{formatearMoneda(compra.total)}</strong>
          </div>
        </section>
      ) : null}
    </Modal>
  );
}
