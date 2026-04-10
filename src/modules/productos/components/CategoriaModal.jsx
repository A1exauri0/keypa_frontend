import { useEffect, useState } from 'react';
import Modal from '../../../core/components/ui/Modal';
import Button from '../../../core/components/ui/Button';
import InputText from '../../../core/components/ui/InputText';
import Select from '../../../core/components/ui/Select';
import { slugifyText } from '../../../core/utils/slugify';

const estadoInicial = {
  nombre: '',
  descripcion: '',
  activo: true,
};

export default function CategoriaModal({ open, modo, categoria, loading, onClose, onSubmit }) {
  const [form, setForm] = useState(estadoInicial);

  useEffect(() => {
    if (open) {
      setForm(
        categoria
          ? {
              nombre: categoria.nombre || '',
              descripcion: categoria.descripcion || '',
              activo: Boolean(categoria.activo),
            }
          : estadoInicial,
      );
    }
  }, [open, categoria]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ ...form, slug: slugifyText(form.nombre), activo: Boolean(form.activo) });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={modo === 'editar' ? 'Actualizar categoria' : 'Agregar categoria'}
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="categoriaForm" disabled={loading}>
            {loading ? 'Guardando...' : modo === 'editar' ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      }
      widthClass="max-w-2xl"
    >
      <form id="categoriaForm" className="grid gap-3" onSubmit={handleSubmit}>
        <InputText
          id="categoriaNombre"
          label="Nombre"
          value={form.nombre}
          onChange={(value) => setForm((prev) => ({ ...prev, nombre: value }))}
          required
        />
        <InputText
          id="categoriaDescripcion"
          label="Descripcion"
          value={form.descripcion}
          onChange={(value) => setForm((prev) => ({ ...prev, descripcion: value }))}
        />

        <Select
          id="categoriaActivo"
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
