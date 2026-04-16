import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import Button from "../../../core/components/ui/buttons/Button";
import InputNumber from "../../../core/components/ui/inputs/InputNumber";
import TextArea from "../../../core/components/ui/inputs/TextArea";
import Modal from "../../../core/components/ui/overlays/Modal";
import Select from "../../../core/components/ui/selectors/Select";

const estadoInicial = {
  idProveedor: "",
  idAlmacen: "",
  observaciones: "",
  detalles: [{ idProducto: "", cantidad: 1 }],
};

export default function CompraModal({
  open,
  loading,
  proveedores = [],
  almacenes = [],
  productos = [],
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(estadoInicial);
  const [error, setError] = useState("");

  const opcionesProveedor = useMemo(
    () =>
      proveedores
        .filter((item) => item.activo)
        .map((item) => ({
          value: String(item.idProveedor),
          label: item.nombre,
        })),
    [proveedores],
  );

  const opcionesAlmacen = useMemo(
    () =>
      almacenes
        .filter((item) => item.activo)
        .map((item) => ({
          value: String(item.idAlmacen),
          label: `${item.nombre} (${item.sucursal?.nombre || "Sin sucursal"})`,
        })),
    [almacenes],
  );

  const opcionesProducto = useMemo(
    () =>
      productos
        .filter((item) => item.activo)
        .map((item) => ({
          value: String(item.idProducto),
          label: `${item.nombre} (${item.sku})`,
        })),
    [productos],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm({
      ...estadoInicial,
      idProveedor: opcionesProveedor[0]?.value || "",
      idAlmacen: opcionesAlmacen[0]?.value || "",
    });
    setError("");
  }, [open, opcionesProveedor, opcionesAlmacen]);

  const totalEstimado = useMemo(() => {
    return form.detalles.reduce((acc, item) => {
      const cantidad = Number(item.cantidad || 0);
      const producto = productos.find(
        (registro) => String(registro.idProducto) === String(item.idProducto),
      );
      const costo = Number(producto?.costo || 0);
      if (!Number.isFinite(cantidad) || !Number.isFinite(costo)) {
        return acc;
      }

      return acc + cantidad * costo;
    }, 0);
  }, [form.detalles, productos]);

  const actualizarDetalle = (index, changes) => {
    setForm((prev) => ({
      ...prev,
      detalles: prev.detalles.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...changes } : item,
      ),
    }));
  };

  const agregarDetalle = () => {
    setForm((prev) => ({
      ...prev,
      detalles: [...prev.detalles, { idProducto: "", cantidad: 1 }],
    }));
  };

  const eliminarDetalle = (index) => {
    setForm((prev) => ({
      ...prev,
      detalles: prev.detalles.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.idProveedor || !form.idAlmacen) {
      setError("Debes seleccionar proveedor y almacen");
      return;
    }

    const detallePayload = form.detalles
      .filter((item) => item.idProducto && Number(item.cantidad) > 0)
      .map((item) => ({
        idProducto: Number(item.idProducto),
        cantidad: Number(item.cantidad),
      }));

    if (detallePayload.length < 1) {
      setError("Debes agregar al menos un producto con cantidad valida");
      return;
    }

    setError("");
    onSubmit({
      idProveedor: Number(form.idProveedor),
      idAlmacen: Number(form.idAlmacen),
      observaciones: form.observaciones.trim() || null,
      detalles: detallePayload,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Registrar compra"
      widthClass="max-w-4xl"
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="compraForm" disabled={loading}>
            {loading ? "Guardando..." : "Registrar compra"}
          </Button>
        </div>
      }
    >
      <form id="compraForm" className="grid gap-3" onSubmit={handleSubmit}>
        <div className="grid gap-3 md:grid-cols-2">
          <Select
            id="compraProveedor"
            label="Proveedor"
            value={form.idProveedor}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, idProveedor: value }))
            }
            options={[
              { value: "", label: "Seleccionar proveedor" },
              ...opcionesProveedor,
            ]}
          />

          <Select
            id="compraAlmacen"
            label="Almacen"
            value={form.idAlmacen}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, idAlmacen: value }))
            }
            options={[
              { value: "", label: "Seleccionar almacen" },
              ...opcionesAlmacen,
            ]}
          />
        </div>

        <TextArea
          id="compraObservaciones"
          label="Observaciones"
          value={form.observaciones}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, observaciones: value }))
          }
          placeholder="Escribe una referencia de la compra (opcional)"
          maxLength={255}
          rows={3}
        />

        <div className="rounded-xl border border-slate-200 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-800">
              Detalle de productos
            </h4>
            <Button type="button" variant="ghost" onClick={agregarDetalle}>
              <Icon icon="mdi:plus" width="16" />
              Agregar producto
            </Button>
          </div>

          <div className="grid gap-2">
            {form.detalles.map((item, index) => {
              // 1. Buscamos el producto completo usando el ID seleccionado
              const producto = productos.find(
                (p) => String(p.idProducto) === String(item.idProducto),
              );
              // 2. Extraemos el costo (si no hay, usamos 0)
              const costoUnitario = Number(producto?.costo || 0);
              // 3. Calculamos el subtotal
              const subtotal = costoUnitario * Number(item.cantidad || 1);

              return (
                <div
                  key={`${index}-${item.idProducto}`}
                  className="grid gap-2 rounded-lg bg-slate-50 p-2 items-end md:grid-cols-[1fr_130px_100px_auto]"
                >
                  <Select
                    id={`compraDetalleProducto-${index}`}
                    label={index === 0 ? "Producto" : ""}
                    value={item.idProducto}
                    onChange={(value) =>
                      actualizarDetalle(index, { idProducto: value })
                    }
                    options={[
                      { value: "", label: "Seleccionar producto" },
                      ...opcionesProducto,
                    ]}
                  />

                  <InputNumber
                    id={`compraDetalleCantidad-${index}`}
                    label={index === 0 ? "Cantidad" : ""}
                    value={item.cantidad}
                    min={1}
                    onChange={(value) =>
                      actualizarDetalle(index, { cantidad: value || 1 })
                    }
                  />

                  <div className="flex flex-col">
                    {index === 0 && (
                      <label className="mb-1 text-sm font-medium text-slate-700">
                        Costo unitario
                      </label>
                    )}
                    <div className="flex h-[42px] items-center">
                      <span className="text-base font-semibold text-slate-800">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex h-[42px] items-center">
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
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2">
          <p className="text-sm text-slate-600">Total de compra</p>
          <strong className="text-base text-slate-900">
            ${totalEstimado.toFixed(2)}
          </strong>
        </div>

        {error ? (
          <p className="text-sm font-medium text-rose-600">{error}</p>
        ) : null}
      </form>
    </Modal>
  );
}
