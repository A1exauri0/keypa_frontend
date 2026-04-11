import { Icon } from '@iconify/react';
import { useEffect, useMemo, useState } from 'react';
import Button from '../../../core/components/ui/buttons/Button';
import InputNumber from '../../../core/components/ui/inputs/InputNumber';
import Modal from '../../../core/components/ui/overlays/Modal';
import Select from '../../../core/components/ui/selectors/Select';
import { obtenerCatalogoInventarioVenta } from '../services/ventasService';

const estadoInicial = {
  idCliente: '',
  idAlmacen: '',
  tipoPago: 'efectivo',
  montoPagado: '',
  detalles: [{ idProducto: '', cantidad: 1 }],
};

function obtenerClienteGeneral(clientes = []) {
  return clientes.find((item) => item.email === 'cliente.general@keypa.local');
}

export default function VentaModal({
  open,
  loading,
  clientes = [],
  almacenes = [],
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(estadoInicial);
  const [error, setError] = useState('');
  const [inventarioDisponible, setInventarioDisponible] = useState([]);
  const [cargandoInventario, setCargandoInventario] = useState(false);

  const opcionesCliente = useMemo(
    () =>
      clientes
        .filter((item) => item.activo)
        .map((item) => ({
          value: String(item.idCliente),
          label: `${item.nombre} ${item.apellidos}`,
        })),
    [clientes],
  );

  const opcionesAlmacen = useMemo(
    () =>
      almacenes
        .filter((item) => item.activo)
        .map((item) => ({
          value: String(item.idAlmacen),
          label: `${item.nombre} (${item.sucursal?.nombre || 'Sin sucursal'})`,
        })),
    [almacenes],
  );

  const opcionesProducto = useMemo(
    () =>
      inventarioDisponible
        .map((item) => ({
          value: String(item.producto.idProducto),
          label: `${item.producto.nombre} (${item.producto.sku}) · Stock ${item.stockActual}`,
        })),
    [inventarioDisponible],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const clienteGeneral = obtenerClienteGeneral(clientes);

    setForm({
      ...estadoInicial,
      idCliente: clienteGeneral ? String(clienteGeneral.idCliente) : '',
      idAlmacen: almacenes[0] ? String(almacenes[0].idAlmacen) : '',
    });
    setError('');
  }, [open, clientes, almacenes]);

  useEffect(() => {
    if (!open || !form.idAlmacen) {
      setInventarioDisponible([]);
      return;
    }

    let activo = true;

    const cargarInventario = async () => {
      setCargandoInventario(true);
      try {
        const data = await obtenerCatalogoInventarioVenta(Number(form.idAlmacen));
        if (!activo) {
          return;
        }

        setInventarioDisponible(data);
      } catch (_error) {
        if (!activo) {
          return;
        }

        setInventarioDisponible([]);
        setError('No se pudo cargar inventario disponible para ese almacen');
      } finally {
        if (activo) {
          setCargandoInventario(false);
        }
      }
    };

    cargarInventario();

    return () => {
      activo = false;
    };
  }, [open, form.idAlmacen]);

  const totalEstimado = useMemo(() => {
    return form.detalles.reduce((acc, item) => {
      const inventario = inventarioDisponible.find(
        (p) => String(p.producto.idProducto) === String(item.idProducto),
      );
      const producto = inventario?.producto;
      if (!producto || !item.cantidad) {
        return acc;
      }

      const precio = Number(producto.precio || 0);
      return acc + precio * Number(item.cantidad || 0);
    }, 0);
  }, [form.detalles, inventarioDisponible]);

  const cambioCalculado = useMemo(() => {
    if (form.tipoPago !== 'efectivo') {
      return 0;
    }

    const montoPagado = Number(form.montoPagado || 0);
    if (!Number.isFinite(montoPagado)) {
      return 0;
    }

    const cambio = montoPagado - totalEstimado;
    return cambio > 0 ? cambio : 0;
  }, [form.tipoPago, form.montoPagado, totalEstimado]);

  const actualizarDetalle = (index, changes) => {
    setForm((prev) => ({
      ...prev,
      detalles: prev.detalles.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...changes } : item,
      ),
    }));
  };

  const obtenerStockPorProducto = (idProducto) => {
    const registro = inventarioDisponible.find(
      (item) => String(item.producto.idProducto) === String(idProducto),
    );

    return registro ? Number(registro.stockActual) : 0;
  };

  const obtenerMaximoCantidadLinea = (index) => {
    const detalleActual = form.detalles[index];
    if (!detalleActual?.idProducto) {
      return undefined;
    }

    const idProducto = String(detalleActual.idProducto);
    const stockTotal = obtenerStockPorProducto(idProducto);
    const consumidoPorOtrasLineas = form.detalles.reduce((acc, item, itemIndex) => {
      if (itemIndex === index) {
        return acc;
      }

      if (String(item.idProducto) !== idProducto) {
        return acc;
      }

      return acc + Number(item.cantidad || 0);
    }, 0);

    const maximo = stockTotal - consumidoPorOtrasLineas;
    return maximo > 0 ? maximo : 1;
  };

  const agregarDetalle = () => {
    setForm((prev) => ({
      ...prev,
      detalles: [...prev.detalles, { idProducto: '', cantidad: 1 }],
    }));
  };

  const eliminarDetalle = (index) => {
    setForm((prev) => ({
      ...prev,
      detalles: prev.detalles.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const validarCantidadesContraStock = (detalles) => {
    const acumulado = new Map();

    for (const item of detalles) {
      const previo = acumulado.get(item.idProducto) || 0;
      acumulado.set(item.idProducto, previo + item.cantidad);
    }

    for (const [idProducto, cantidad] of acumulado.entries()) {
      const registro = inventarioDisponible.find(
        (item) => item.producto.idProducto === idProducto,
      );

      if (!registro || registro.stockActual < cantidad) {
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.idCliente || !form.idAlmacen) {
      setError('Debes seleccionar cliente y almacen');
      return;
    }

    const detallePayload = form.detalles
      .filter((item) => item.idProducto && Number(item.cantidad) > 0)
      .map((item) => ({
        idProducto: Number(item.idProducto),
        cantidad: Number(item.cantidad),
      }));

    if (detallePayload.length < 1) {
      setError('Debes agregar al menos un producto con cantidad valida');
      return;
    }

    if (!validarCantidadesContraStock(detallePayload)) {
      setError('La cantidad solicitada supera el stock disponible de uno o mas productos');
      return;
    }

    if (form.tipoPago === 'efectivo') {
      const montoPagado = Number(form.montoPagado || 0);

      if (!Number.isFinite(montoPagado) || montoPagado <= 0) {
        setError('Debes capturar un monto pagado valido para pago en efectivo');
        return;
      }

      if (montoPagado < totalEstimado) {
        setError('El monto pagado no puede ser menor al total de la venta');
        return;
      }
    }

    setError('');
    onSubmit({
      idCliente: Number(form.idCliente),
      idAlmacen: Number(form.idAlmacen),
      tipoPago: form.tipoPago,
      montoPagado: form.tipoPago === 'efectivo' ? Number(form.montoPagado || 0) : totalEstimado,
      cambio: form.tipoPago === 'efectivo' ? cambioCalculado : 0,
      detalles: detallePayload,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Registrar venta"
      widthClass="max-w-4xl"
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="ventaForm" disabled={loading}>
            {loading ? 'Guardando...' : 'Registrar venta'}
          </Button>
        </div>
      }
    >
      <form id="ventaForm" className="grid gap-3" onSubmit={handleSubmit}>
        <div className="grid gap-3 md:grid-cols-3">
          <Select
            id="ventaCliente"
            label="Cliente"
            value={form.idCliente}
            onChange={(value) => setForm((prev) => ({ ...prev, idCliente: value }))}
            options={[{ value: '', label: 'Seleccionar cliente' }, ...opcionesCliente]}
          />

          <Select
            id="ventaAlmacen"
            label="Almacen"
            value={form.idAlmacen}
            onChange={(value) => setForm((prev) => ({ ...prev, idAlmacen: value }))}
            options={[{ value: '', label: 'Seleccionar almacen' }, ...opcionesAlmacen]}
          />

          <Select
            id="ventaTipoPago"
            label="Tipo de pago"
            value={form.tipoPago}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                tipoPago: value,
                montoPagado: value === 'transferencia' ? String(totalEstimado || 0) : prev.montoPagado,
              }))
            }
            options={[
              { value: 'efectivo', label: 'Efectivo' },
              { value: 'transferencia', label: 'Transferencia' },
            ]}
          />
        </div>

        {form.tipoPago === 'efectivo' ? (
          <div className="grid gap-3 md:grid-cols-2">
            <InputNumber
              id="ventaMontoPagado"
              label="Monto pagado"
              value={form.montoPagado}
              min={0}
              step={0.01}
              onChange={(value) => setForm((prev) => ({ ...prev, montoPagado: value }))}
            />

            <InputNumber
              id="ventaCambio"
              label="Cambio"
              value={Number(cambioCalculado.toFixed(2))}
              min={0}
              step={0.01}
              disabled
            />
          </div>
        ) : null}

        <div className="rounded-xl border border-slate-200 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-800">Detalle de productos</h4>
            <Button type="button" variant="ghost" onClick={agregarDetalle}>
              <Icon icon="mdi:plus" width="16" />
              Agregar linea
            </Button>
          </div>

          <div className="grid gap-2">
            {cargandoInventario ? (
              <p className="text-xs text-slate-500">Cargando productos con stock...</p>
            ) : null}

            {!cargandoInventario && opcionesProducto.length < 1 ? (
              <p className="text-xs text-slate-500">No hay productos con stock en el almacen seleccionado.</p>
            ) : null}

            {form.detalles.map((item, index) => (
              <div key={`${index}-${item.idProducto}`} className="grid gap-2 rounded-lg bg-slate-50 p-2 md:grid-cols-[1fr_170px_auto]">
                <Select
                  id={`ventaDetalleProducto-${index}`}
                  label={index === 0 ? 'Producto' : ''}
                  containerClassName={index === 0 ? '' : 'md:pt-[30px]'}
                  value={item.idProducto}
                  onChange={(value) => actualizarDetalle(index, { idProducto: value })}
                  options={[{ value: '', label: 'Seleccionar producto' }, ...opcionesProducto]}
                />

                <InputNumber
                  id={`ventaDetalleCantidad-${index}`}
                  label={index === 0 ? 'Cantidad' : ''}
                  value={item.cantidad}
                  min={1}
                  max={obtenerMaximoCantidadLinea(index)}
                  onChange={(value) => actualizarDetalle(index, { cantidad: value || 1 })}
                />

                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="danger"
                    disabled={form.detalles.length <= 1}
                    onClick={() => eliminarDetalle(index)}
                  >
                    <Icon icon="mdi:delete-outline" width="16" />
                    Quitar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2">
          <p className="text-sm text-slate-600">Total</p>
          <strong className="text-base text-slate-900">
            ${totalEstimado.toFixed(2)}
          </strong>
        </div>

        {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      </form>
    </Modal>
  );
}
