import { useEffect, useState } from 'react';
import Modal from '../../../core/components/ui/overlays/Modal';
import Button from '../../../core/components/ui/buttons/Button';
import InputText from '../../../core/components/ui/inputs/InputText';
import InputNumber from '../../../core/components/ui/inputs/InputNumber';
import Select from '../../../core/components/ui/selectors/Select';

const estadoInicial = {
  nombre: '',
  contactoNombre: '',
  telefono: '',
  email: '',
  direccion: '',
  activo: true,
};

export default function ProveedorModal({
  open,
  modo,
  proveedor,
  loading,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(estadoInicial);

  useEffect(() => {
    if (open) {
      setForm(
        proveedor
          ? {
              nombre: proveedor.nombre || '',
              contactoNombre: proveedor.contactoNombre || '',
              telefono: proveedor.telefono || '',
              email: proveedor.email || '',
              direccion: proveedor.direccion || '',
              activo: Boolean(proveedor.activo),
            }
          : estadoInicial,
      );
    }
  }, [open, proveedor]);

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      nombre: form.nombre.trim(),
      contactoNombre: form.contactoNombre.trim() || null,
      telefono: form.telefono.trim() || null,
      email: form.email.trim() || null,
      direccion: form.direccion.trim() || null,
      activo: Boolean(form.activo),
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={modo === 'editar' ? 'Actualizar proveedor' : 'Agregar proveedor'}
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="proveedorForm" disabled={loading}>
            {loading ? 'Guardando...' : modo === 'editar' ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      }
      widthClass="max-w-3xl"
    >
      <form id="proveedorForm" className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
        <InputText
          id="proveedorNombre"
          label="Nombre"
          value={form.nombre}
          onChange={(value) => setForm((prev) => ({ ...prev, nombre: value }))}
          required
        />

        <InputText
          id="proveedorContacto"
          label="Contacto"
          value={form.contactoNombre}
          onChange={(value) => setForm((prev) => ({ ...prev, contactoNombre: value }))}
        />

        <InputNumber
          id="proveedorTelefono"
          label="Telefono"
          value={form.telefono}
          onChange={(value) => setForm((prev) => ({ ...prev, telefono: value }))}
        />

        <InputText
          id="proveedorEmail"
          label="Email"
          type="email"
          value={form.email}
          onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
        />

        <div className="md:col-span-2">
          <InputText
            id="proveedorDireccion"
            label="Direccion"
            value={form.direccion}
            onChange={(value) => setForm((prev) => ({ ...prev, direccion: value }))}
          />
        </div>

        <div className="md:col-span-2">
          <Select
            id="proveedorActivo"
            label="Estado del registro"
            value={form.activo ? 'true' : 'false'}
            onChange={(value) => setForm((prev) => ({ ...prev, activo: value === 'true' }))}
            options={[
              { value: 'true', label: 'Activo' },
              { value: 'false', label: 'Inactivo' },
            ]}
          />
        </div>
      </form>
    </Modal>
  );
}
