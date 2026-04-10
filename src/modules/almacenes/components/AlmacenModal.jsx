import { useEffect, useMemo, useState } from 'react';
import Modal from '../../../core/components/ui/overlays/Modal';
import Button from '../../../core/components/ui/buttons/Button';
import InputText from '../../../core/components/ui/inputs/InputText';
import Select from '../../../core/components/ui/selectors/Select';

const estadoInicial = {
  idSucursal: '',
  nombre: '',
  activo: true,
};

export default function AlmacenModal({
  open,
  modo,
  almacen,
  sucursales = [],
  loading,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(estadoInicial);

  const opcionesSucursal = useMemo(
    () =>
      sucursales.map((item) => ({
        value: String(item.idSucursal),
        label: item.nombre,
      })),
    [sucursales],
  );

  useEffect(() => {
    if (open) {
      setForm(
        almacen
          ? {
              idSucursal: almacen.idSucursal ? String(almacen.idSucursal) : '',
              nombre: almacen.nombre || '',
              activo: Boolean(almacen.activo),
            }
          : estadoInicial,
      );
    }
  }, [open, almacen]);

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      idSucursal: Number(form.idSucursal),
      nombre: form.nombre.trim(),
      activo: Boolean(form.activo),
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={modo === 'editar' ? 'Actualizar almacen' : 'Agregar almacen'}
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="almacenForm" disabled={loading}>
            {loading ? 'Guardando...' : modo === 'editar' ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      }
      widthClass="max-w-3xl"
    >
      <form id="almacenForm" className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
        <Select
          id="almacenSucursal"
          label="Sucursal"
          value={form.idSucursal}
          onChange={(value) => setForm((prev) => ({ ...prev, idSucursal: value }))}
          options={[{ value: '', label: 'Seleccionar sucursal' }, ...opcionesSucursal]}
          required
        />

        <InputText
          id="almacenNombre"
          label="Nombre"
          value={form.nombre}
          onChange={(value) => setForm((prev) => ({ ...prev, nombre: value }))}
          required
        />

        <Select
          id="almacenActivo"
          label="Estado del registro"
          value={form.activo ? 'true' : 'false'}
          onChange={(value) => setForm((prev) => ({ ...prev, activo: value === 'true' }))}
          options={[
            { value: 'true', label: 'Activo' },
            { value: 'false', label: 'Inactivo' },
          ]}
        />
      </form>
    </Modal>
  );
}
