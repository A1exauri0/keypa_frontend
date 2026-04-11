import { useEffect, useMemo, useState } from "react";
import Modal from "../../../core/components/ui/overlays/Modal";
import Button from "../../../core/components/ui/buttons/Button";
import Select from "../../../core/components/ui/selectors/Select";
import InputNumber from "../../../core/components/ui/inputs/InputNumber";

const estadoInicial = {
  idAlmacen: "",
  idProducto: "",
  stockActual: "0",
};

export default function InventarioModal({
  open,
  modo,
  inventario,
  almacenes = [],
  productos = [],
  loading,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(estadoInicial);
  const [errores, setErrores] = useState({});
  const esAjuste = modo === "ajustar";

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

  const opcionesProducto = useMemo(() => {
    if (!form.idAlmacen) return [];

    // Filtrar productos por almacén seleccionado
    return productos
      .filter(
        (item) =>
          item.activo &&
          item.activo &&
          String(item.idAlmacen) === form.idAlmacen,
      )
      .map((item) => ({
        value: String(item.idProducto),
        label: `${item.nombre} (${item.sku})`,
      }));
  }, [productos, form.idAlmacen]);

  const sinProductos = form.idAlmacen && opcionesProducto.length === 0;

  useEffect(() => {
    if (!open) {
      return;
    }

    setErrores({});

    if (inventario) {
      setForm({
        idAlmacen: String(inventario.idAlmacen || ""),
        idProducto: String(inventario.idProducto || ""),
        stockActual: String(inventario.stockActual ?? 0),
      });
      return;
    }

    setForm(estadoInicial);
  }, [open, inventario]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const erroresForm = {};

    if (!esAjuste && !form.idAlmacen) {
      erroresForm.idAlmacen = "Selecciona un almacen";
    }

    if (!esAjuste && !form.idProducto) {
      erroresForm.idProducto = "Selecciona un producto";
    }

    if (form.stockActual === "" || Number(form.stockActual) < 0) {
      erroresForm.stockActual = "Ingresa un stock valido";
    }

    if (Object.keys(erroresForm).length > 0) {
      setErrores(erroresForm);
      return;
    }

    setErrores({});

    if (esAjuste) {
      onSubmit({
        stockActual: Number(form.stockActual || 0),
      });
      return;
    }

    onSubmit({
      idAlmacen: Number(form.idAlmacen),
      idProducto: Number(form.idProducto),
      stockActual: Number(form.stockActual || 0),
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        esAjuste
          ? "Ajustar stock"
          : modo === "editar"
            ? "Actualizar inventario"
            : "Registrar inventario"
      }
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="inventarioForm" disabled={loading}>
            {loading
              ? "Guardando..."
              : esAjuste
                ? "Guardar ajuste"
                : modo === "editar"
                  ? "Actualizar"
                  : "Guardar"}
          </Button>
        </div>
      }
      widthClass="max-w-md"
    >
      <form id="inventarioForm" className="grid gap-3" onSubmit={handleSubmit}>
        <Select
          id="inventarioAlmacen"
          label="Almacén"
          value={form.idAlmacen}
          disabled={esAjuste}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, idAlmacen: value }))
          }
          options={[
            { value: "", label: "Seleccionar almacén" },
            ...opcionesAlmacen,
          ]}
        />
        {errores.idAlmacen ? (
          <p className="-mt-2 text-xs text-rose-600">{errores.idAlmacen}</p>
        ) : null}

        <Select
          id="inventarioProducto"
          label="Producto"
          value={form.idProducto}
          disabled={esAjuste || !form.idAlmacen}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, idProducto: value }))
          }
          options={[
            {
              value: "",
              label: !form.idAlmacen
                ? "Selecciona un almacén primero"
                : sinProductos
                  ? "No hay productos en este almacén"
                  : "Seleccionar producto",
            },
            ...opcionesProducto,
          ]}
        />
        {errores.idProducto ? (
          <p className="-mt-2 text-xs text-rose-600">{errores.idProducto}</p>
        ) : null}

        <InputNumber
          id="inventarioStockActual"
          label="Stock actual"
          value={form.stockActual}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, stockActual: value }))
          }
          min={0}
          error={errores.stockActual}
          required
        />
      </form>
    </Modal>
  );
}
