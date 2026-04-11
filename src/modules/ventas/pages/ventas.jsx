import { Icon } from '@iconify/react';
import { useEffect, useMemo, useState } from 'react';
import Button from '../../../core/components/ui/buttons/Button';
import InputText from '../../../core/components/ui/inputs/InputText';
import Select from '../../../core/components/ui/selectors/Select';
import ConfirmDialog from '../../../core/components/ui/overlays/ConfirmDialog';
import { useToast } from '../../../core/components/ui/feedback/Toast';
import { useAuth } from '../../../context/AuthContext';
import VentaModal from '../components/VentaModal';
import VentaDetalleModal from '../components/VentaDetalleModal';
import VentaExitosaModal from '../components/VentaExitosaModal';
import { actualizarEstadoVenta, crearVenta, listarVentas, obtenerVentaPorId } from '../services/ventasService';
import { listarClientes } from '../../clientes/services/clientesService';
import { listarAlmacenes } from '../../almacenes/services/almacenesService';

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

export default function VentasPage() {
  const { toast } = useToast();
  const { usuario } = useAuth();
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [ventaDetalle, setVentaDetalle] = useState(null);
  const [ventaExitosaOpen, setVentaExitosaOpen] = useState(false);
  const [ventaExitosa, setVentaExitosa] = useState(null);
  const [confirmEstadoOpen, setConfirmEstadoOpen] = useState(false);
  const [confirmEstadoVenta, setConfirmEstadoVenta] = useState(null);
  const [confirmEstadoDestino, setConfirmEstadoDestino] = useState('');
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const esAdmin = useMemo(() => {
    const roles = Array.isArray(usuario?.roles) ? usuario.roles : [];
    return roles.some((rol) => String(rol).toLowerCase() === 'admin');
  }, [usuario]);

  const cargar = async () => {
    setLoading(true);
    try {
      const [ventasData, clientesData, almacenesData] = await Promise.all([
        listarVentas(),
        listarClientes(),
        listarAlmacenes(),
      ]);

      setVentas(ventasData);
      setClientes(clientesData);
      setAlmacenes(almacenesData);
    } catch (error) {
      toast({
        title: 'No se pudo cargar ventas',
        message: error.response?.data?.message,
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const ventasFiltradas = useMemo(() => {
    const q = search.trim().toLowerCase();

    return ventas.filter((item) => {
      const clienteNombre = `${item.cliente?.nombre || ''} ${item.cliente?.apellidos || ''}`.toLowerCase();
      const coincideBusqueda =
        !q ||
        (item.folio || '').toLowerCase().includes(q) ||
        clienteNombre.includes(q) ||
        (item.almacen?.nombre || '').toLowerCase().includes(q);

      const coincideEstado = filtroEstado === 'todos' || item.estado === filtroEstado;

      return coincideBusqueda && coincideEstado;
    });
  }, [ventas, search, filtroEstado]);

  const registrarVenta = async (payload) => {
    setSaving(true);
    try {
      const venta = await crearVenta(payload);
      let ventaFinal = venta;

      if (venta?.estado === 'pendiente') {
        ventaFinal = await actualizarEstadoVenta(venta.idVenta, 'pagado');
      }

      setVentaExitosa(ventaFinal);
      setVentaExitosaOpen(true);

      toast({ title: 'Venta registrada', variant: 'success' });
      setModalOpen(false);
      await cargar();
    } catch (error) {
      toast({
        title: 'No se pudo registrar venta',
        message: error.response?.data?.message || 'Verifica los datos enviados.',
        variant: 'danger',
      });
    } finally {
      setSaving(false);
    }
  };

  const abrirDetalle = async (venta) => {
    setSaving(true);
    try {
      const ventaCompleta = await obtenerVentaPorId(venta.idVenta);
      setVentaDetalle(ventaCompleta);
      setDetalleOpen(true);
    } catch (error) {
      toast({
        title: 'No se pudo cargar el detalle',
        message: error.response?.data?.message,
        variant: 'danger',
      });
    } finally {
      setSaving(false);
    }
  };

  const solicitarCambioEstado = (venta, estadoDestino) => {
    if (!esAdmin) {
      toast({
        title: 'Accion no permitida',
        message: 'Solo un administrador puede pagar o cancelar ventas.',
        variant: 'warning',
      });
      return;
    }

    setConfirmEstadoVenta(venta);
    setConfirmEstadoDestino(estadoDestino);
    setConfirmEstadoOpen(true);
  };

  const confirmarCambioEstado = async () => {
    if (!confirmEstadoVenta?.idVenta || !confirmEstadoDestino) {
      setConfirmEstadoOpen(false);
      return;
    }

    await cambiarEstado(confirmEstadoVenta.idVenta, confirmEstadoDestino);
    setConfirmEstadoOpen(false);
    setConfirmEstadoVenta(null);
    setConfirmEstadoDestino('');
  };

  const cambiarEstado = async (idVenta, estado) => {
    setSaving(true);
    try {
      await actualizarEstadoVenta(idVenta, estado);
      toast({
        title: estado === 'pagado' ? 'Venta marcada como pagada' : 'Venta cancelada',
        variant: estado === 'pagado' ? 'success' : 'warning',
      });
      await cargar();
    } catch (error) {
      toast({
        title: 'No se pudo actualizar estado',
        message: error.response?.data?.message,
        variant: 'danger',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="grid gap-4">
      <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:p-5">
        <header className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 md:text-xl">Ventas</h3>
            <p className="text-sm text-slate-600">Registro de ventas por cliente, estado y tipo de pago.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={cargar}>
              <Icon icon="tabler:reload" width="16" />
              Recargar
            </Button>
            <Button type="button" onClick={() => setModalOpen(true)}>
              <Icon icon="mdi:cash-register" width="16" />
              Registrar venta
            </Button>
          </div>
        </header>

        <div className="mb-4 grid gap-3 md:grid-cols-2">
          <InputText
            id="ventasSearch"
            label="Buscar"
            value={search}
            onChange={setSearch}
            placeholder="Folio, cliente o almacen"
          />

          <Select
            id="ventasEstadoFiltro"
            label="Estado"
            value={filtroEstado}
            onChange={setFiltroEstado}
            options={[
              { value: 'todos', label: 'Todos' },
              { value: 'pendiente', label: 'Pendiente' },
              { value: 'pagado', label: 'Pagado' },
              { value: 'cancelado', label: 'Cancelado' },
            ]}
          />
        </div>

        {loading ? <p className="text-sm text-slate-500">Cargando ventas...</p> : null}

        {!loading ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[980px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-2 pr-3">Folio</th>
                    <th className="py-2 pr-3">Cliente</th>
                    <th className="py-2 pr-3">Almacen</th>
                    <th className="py-2 pr-3">Pago</th>
                    <th className="py-2 pr-3">Estado</th>
                    <th className="py-2 pr-3">Total</th>
                    <th className="py-2 pr-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ventasFiltradas.map((item) => (
                    <tr key={item.idVenta} className="border-b border-slate-100">
                      <td className="py-2 pr-3 text-slate-700">{item.folio}</td>
                      <td className="py-2 pr-3 text-slate-700">{item.cliente?.nombre} {item.cliente?.apellidos}</td>
                      <td className="py-2 pr-3 text-slate-700">{item.almacen?.nombre || '-'}</td>
                      <td className="py-2 pr-3 text-slate-700">{item.tipoPago === 'efectivo' ? 'Efectivo' : 'Transferencia'}</td>
                      <td className="py-2 pr-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            item.estado === 'pagado'
                              ? 'bg-emerald-100 text-emerald-700'
                              : item.estado === 'cancelado'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {etiquetaEstado(item.estado)}
                        </span>
                      </td>
                      <td className="py-2 pr-3 text-slate-700">{formatearMoneda(item.total)}</td>
                      <td className="py-2 pr-3">
                        <div className="flex justify-end gap-1">
                          {item.estado === 'pendiente' && esAdmin ? (
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-200"
                              onClick={() => solicitarCambioEstado(item, 'pagado')}
                              disabled={saving}
                            >
                              <Icon icon="mdi:check-circle-outline" width="14" />
                              Pagar
                            </button>
                          ) : null}

                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                            onClick={() => abrirDetalle(item)}
                          >
                            <Icon icon="mdi:eye-outline" width="14" />
                            Ver
                          </button>

                          {item.estado !== 'cancelado' && esAdmin ? (
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-200"
                              onClick={() => solicitarCambioEstado(item, 'cancelado')}
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
              {ventasFiltradas.map((item) => (
                <div key={item.idVenta} className="rounded-xl border border-slate-200 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <strong className="text-sm text-slate-800">{item.folio}</strong>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        item.estado === 'pagado'
                          ? 'bg-emerald-100 text-emerald-700'
                          : item.estado === 'cancelado'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {etiquetaEstado(item.estado)}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700">Cliente: {item.cliente?.nombre} {item.cliente?.apellidos}</p>
                  <p className="text-sm text-slate-700">Almacen: {item.almacen?.nombre || '-'}</p>
                  <p className="text-sm text-slate-700">Pago: {item.tipoPago === 'efectivo' ? 'Efectivo' : 'Transferencia'}</p>
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
                    {item.estado === 'pendiente' && esAdmin ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-200"
                        onClick={() => solicitarCambioEstado(item, 'pagado')}
                        disabled={saving}
                      >
                        <Icon icon="mdi:check-circle-outline" width="14" />
                        Pagar
                      </button>
                    ) : null}
                    {item.estado !== 'cancelado' && esAdmin ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-200"
                        onClick={() => solicitarCambioEstado(item, 'cancelado')}
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

            {ventasFiltradas.length < 1 ? (
              <p className="py-6 text-center text-sm text-slate-500">No hay ventas que coincidan con el filtro.</p>
            ) : null}
          </>
        ) : null}
      </article>

      <VentaModal
        open={modalOpen}
        loading={saving}
        clientes={clientes}
        almacenes={almacenes}
        onClose={() => setModalOpen(false)}
        onSubmit={registrarVenta}
      />

      <VentaDetalleModal
        open={detalleOpen}
        venta={ventaDetalle}
        onClose={() => {
          setDetalleOpen(false);
          setVentaDetalle(null);
        }}
      />

      <VentaExitosaModal
        open={ventaExitosaOpen}
        venta={ventaExitosa}
        onClose={() => {
          setVentaExitosaOpen(false);
          setVentaExitosa(null);
        }}
      />

      <ConfirmDialog
        open={confirmEstadoOpen}
        title={confirmEstadoDestino === 'pagado' ? 'Confirmar pago de venta' : 'Confirmar cancelacion de venta'}
        message={`Folio: ${confirmEstadoVenta?.folio || '-'}\n${
          confirmEstadoDestino === 'pagado'
            ? 'Se marcara la venta como pagada.'
            : 'La venta se cancelara y se revertira el stock en inventario.'
        }`}
        confirmLabel={confirmEstadoDestino === 'pagado' ? 'Pagar venta' : 'Cancelar venta'}
        confirmVariant={confirmEstadoDestino === 'pagado' ? 'primary' : 'danger'}
        loading={saving}
        onConfirm={confirmarCambioEstado}
        onCancel={() => {
          setConfirmEstadoOpen(false);
          setConfirmEstadoVenta(null);
          setConfirmEstadoDestino('');
        }}
      />
    </section>
  );
}
