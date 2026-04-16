import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import Button from '../../../core/components/ui/buttons/Button';
import InputText from '../../../core/components/ui/inputs/InputText';
import Select from '../../../core/components/ui/selectors/Select';
import ConfirmDialog from '../../../core/components/ui/overlays/ConfirmDialog';
import { useToast } from '../../../core/components/ui/feedback/Toast';
import { useAuth } from '../../../context/AuthContext';
import CompraModal from '../components/CompraModal';
import CompraDetalleModal from '../components/CompraDetalleModal';
import useComprasData from '../hooks/useComprasData';
import useComprasFiltros from '../hooks/useComprasFiltros';
import useComprasModals from '../hooks/useComprasModals';
import useComprasActions from '../hooks/useComprasActions';

function formatearMoneda(valor) {
  const numero = Number(valor || 0);
  return `$${numero.toFixed(2)}`;
}

function etiquetaEstado(estado) {
  if (estado === 'cancelada') {
    return 'Cancelada';
  }

  return 'Completada';
}

export default function ComprasPage() {
  const { toast } = useToast();
  const { usuario } = useAuth();
  const [saving, setSaving] = useState(false);

  const esAdmin = useMemo(() => {
    const roles = Array.isArray(usuario?.roles) ? usuario.roles : [];
    return roles.some((rol) => String(rol).toLowerCase() === 'admin');
  }, [usuario]);

  const { compras, proveedores, almacenes, productos, loading, cargar } = useComprasData({ toast });
  const { search, setSearch, filtroEstado, setFiltroEstado, comprasFiltradas } = useComprasFiltros(compras);
  const modals = useComprasModals();
  const { registrarCompra, abrirDetalle, solicitarCambioEstado, confirmarCambioEstado } = useComprasActions({
    toast,
    esAdmin,
    cargar,
    setSaving,
    modals,
  });

  return (
    <section className="grid gap-4">
      <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:p-5">
        <header className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 md:text-xl">Compras</h3>
            <p className="text-sm text-slate-600">Registro de compras de producto por proveedor y almacen.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={cargar}>
              <Icon icon="tabler:reload" width="16" />
              Recargar
            </Button>
            <Button type="button" onClick={modals.openRegistro}>
              <Icon icon="mdi:cart-plus" width="16" />
              Registrar compra
            </Button>
          </div>
        </header>

        <div className="mb-4 grid gap-3 md:grid-cols-2">
          <InputText
            id="comprasSearch"
            label="Buscar"
            value={search}
            onChange={setSearch}
            placeholder="Folio, proveedor o almacen"
          />

          <Select
            id="comprasEstadoFiltro"
            label="Estado"
            value={filtroEstado}
            onChange={setFiltroEstado}
            options={[
              { value: 'todos', label: 'Todos' },
              { value: 'completada', label: 'Completada' },
              { value: 'cancelada', label: 'Cancelada' },
            ]}
          />
        </div>

        {loading ? <p className="text-sm text-slate-500">Cargando compras...</p> : null}

        {!loading ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[980px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-2 pr-3">Folio</th>
                    <th className="py-2 pr-3">Proveedor</th>
                    <th className="py-2 pr-3">Almacen</th>
                    <th className="py-2 pr-3">Estado</th>
                    <th className="py-2 pr-3">Total</th>
                    <th className="py-2 pr-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {comprasFiltradas.map((item) => (
                    <tr key={item.idCompra} className="border-b border-slate-100">
                      <td className="py-2 pr-3 text-slate-700">{item.folio}</td>
                      <td className="py-2 pr-3 text-slate-700">{item.proveedor?.nombre || '-'}</td>
                      <td className="py-2 pr-3 text-slate-700">{item.almacen?.nombre || '-'}</td>
                      <td className="py-2 pr-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            item.estado === 'cancelada'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {etiquetaEstado(item.estado)}
                        </span>
                      </td>
                      <td className="py-2 pr-3 text-slate-700">{formatearMoneda(item.total)}</td>
                      <td className="py-2 pr-3">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                            onClick={() => abrirDetalle(item)}
                          >
                            <Icon icon="mdi:eye-outline" width="14" />
                            Ver
                          </button>

                          {item.estado !== 'cancelada' && esAdmin ? (
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-200"
                              onClick={() => solicitarCambioEstado(item, 'cancelada')}
                              disabled={saving}
                            >
                              <Icon icon="mdi:cancel" width="14" />
                              Cancelar
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 md:hidden">
              {comprasFiltradas.map((item) => (
                <div key={item.idCompra} className="rounded-xl border border-slate-200 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <strong className="text-sm text-slate-800">{item.folio}</strong>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        item.estado === 'cancelada'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {etiquetaEstado(item.estado)}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700">Proveedor: {item.proveedor?.nombre || '-'}</p>
                  <p className="text-sm text-slate-700">Almacen: {item.almacen?.nombre || '-'}</p>
                  <p className="text-sm font-semibold text-slate-900">Total: {formatearMoneda(item.total)}</p>

                  <div className="mt-3 flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                      onClick={() => abrirDetalle(item)}
                    >
                      <Icon icon="mdi:eye-outline" width="14" />
                      Ver
                    </button>
                    {item.estado !== 'cancelada' && esAdmin ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-200"
                        onClick={() => solicitarCambioEstado(item, 'cancelada')}
                        disabled={saving}
                      >
                        <Icon icon="mdi:cancel" width="14" />
                        Cancelar
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            {comprasFiltradas.length < 1 ? (
              <p className="py-6 text-center text-sm text-slate-500">No hay compras que coincidan con el filtro.</p>
            ) : null}
          </>
        ) : null}
      </article>

      <CompraModal
        open={modals.modalOpen}
        loading={saving}
        proveedores={proveedores}
        almacenes={almacenes}
        productos={productos}
        onClose={modals.closeRegistro}
        onSubmit={registrarCompra}
      />

      <CompraDetalleModal
        open={modals.detalleOpen}
        compra={modals.compraDetalle}
        onClose={modals.closeDetalle}
      />

      <ConfirmDialog
        open={modals.confirmEstadoOpen}
        title="Confirmar cancelacion de compra"
        message={`Folio: ${modals.confirmEstadoCompra?.folio || '-'}\nLa compra se cancelara y se revertira el stock en inventario.`}
        confirmLabel="Cancelar compra"
        confirmVariant="danger"
        loading={saving}
        onConfirm={confirmarCambioEstado}
        onCancel={modals.closeConfirmEstado}
      />
    </section>
  );
}
