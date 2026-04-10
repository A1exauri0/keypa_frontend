import { useEffect, useState } from 'react';
import Modal from '../../../core/components/ui/overlays/Modal';
import Button from '../../../core/components/ui/buttons/Button';
import InputText from '../../../core/components/ui/inputs/InputText';
import Select from '../../../core/components/ui/selectors/Select';
import { slugifyText } from '../../../core/utils/slugify';

const estadoInicial = {
  nombre: '',
  descripcion: '',
  activo: true,
};

export default function MarcaModal({ open, modo, marca, loading, onClose, onSubmit }) {
  const [form, setForm] = useState(estadoInicial);

  useEffect(() => {
    if (open) {
      setForm(
        marca
          ? {
              nombre: marca.nombre || '',
              descripcion: marca.descripcion || '',
              activo: Boolean(marca.activo),
            }
          : estadoInicial,
      );
    }
  }, [open, marca]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ ...form, slug: slugifyText(form.nombre), activo: Boolean(form.activo) });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={modo === 'editar' ? 'Actualizar marca' : 'Agregar marca'}
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="marcaForm" disabled={loading}>
            {loading ? 'Guardando...' : modo === 'editar' ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      }
      widthClass="max-w-2xl"
    >
      <form id="marcaForm" className="grid gap-3" onSubmit={handleSubmit}>
        <InputText
          id="marcaNombre"
          label="Nombre"
          value={form.nombre}
          onChange={(value) => setForm((prev) => ({ ...prev, nombre: value }))}
          required
        />
        <InputText
          id="marcaDescripcion"
          label="Descripcion"
          value={form.descripcion}
          onChange={(value) => setForm((prev) => ({ ...prev, descripcion: value }))}
        />

        <Select
          id="marcaActivo"
          label="Estado"
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
