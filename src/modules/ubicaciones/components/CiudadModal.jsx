import { useEffect, useState } from 'react';
import Modal from '../../../core/components/ui/overlays/Modal';
import Button from '../../../core/components/ui/buttons/Button';
import InputText from '../../../core/components/ui/inputs/InputText';
import Select from '../../../core/components/ui/selectors/Select';

const estadoInicial = {
  nombre: '',
  estado: 'Chiapas',
  activo: true,
};

export default function CiudadModal({ open, modo, ciudad, loading, onClose, onSubmit }) {
  const [form, setForm] = useState(estadoInicial);

  useEffect(() => {
    if (open) {
      setForm(
        ciudad
          ? {
              nombre: ciudad.nombre || '',
              estado: ciudad.estado || 'Chiapas',
              activo: Boolean(ciudad.activo),
            }
          : estadoInicial,
      );
    }
  }, [open, ciudad]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      nombre: form.nombre.trim(),
      estado: form.estado.trim() || 'Chiapas',
      activo: Boolean(form.activo),
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={modo === 'editar' ? 'Actualizar ciudad' : 'Agregar ciudad'}
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="ciudadForm" disabled={loading}>
            {loading ? 'Guardando...' : modo === 'editar' ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      }
      widthClass="max-w-2xl"
    >
      <form id="ciudadForm" className="grid gap-3" onSubmit={handleSubmit}>
        <InputText
          id="ciudadNombre"
          label="Nombre"
          value={form.nombre}
          onChange={(value) => setForm((prev) => ({ ...prev, nombre: value }))}
          required
        />

        <InputText
          id="ciudadEstado"
          label="Estado"
          value={form.estado}
          onChange={(value) => setForm((prev) => ({ ...prev, estado: value }))}
          required
        />

        <Select
          id="ciudadActivo"
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
