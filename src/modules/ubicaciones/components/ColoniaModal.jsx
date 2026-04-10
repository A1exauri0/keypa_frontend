import { useEffect, useMemo, useState } from 'react';
import Modal from '../../../core/components/ui/overlays/Modal';
import Button from '../../../core/components/ui/buttons/Button';
import InputText from '../../../core/components/ui/inputs/InputText';
import Select from '../../../core/components/ui/selectors/Select';

const estadoInicial = {
  nombre: '',
  codigoPostal: '',
  idCiudad: '',
  activo: true,
};

export default function ColoniaModal({ open, modo, colonia, ciudades = [], loading, onClose, onSubmit }) {
  const [form, setForm] = useState(estadoInicial);

  const opcionesCiudad = useMemo(
    () =>
      ciudades.map((item) => ({
        value: String(item.idCiudad),
        label: item.nombre,
      })),
    [ciudades],
  );

  useEffect(() => {
    if (open) {
      const idCiudadDefault = ciudades[0]?.idCiudad ? String(ciudades[0].idCiudad) : '';

      setForm(
        colonia
          ? {
              nombre: colonia.nombre || '',
              codigoPostal: colonia.codigoPostal || '',
              idCiudad: String(colonia.idCiudad || colonia.ciudad?.idCiudad || idCiudadDefault),
              activo: Boolean(colonia.activo),
            }
          : {
              ...estadoInicial,
              idCiudad: idCiudadDefault,
            },
      );
    }
  }, [open, colonia, ciudades]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      nombre: form.nombre.trim(),
      codigoPostal: form.codigoPostal.trim(),
      idCiudad: Number(form.idCiudad),
      activo: Boolean(form.activo),
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={modo === 'editar' ? 'Actualizar colonia' : 'Agregar colonia'}
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="coloniaForm" disabled={loading || opcionesCiudad.length === 0}>
            {loading ? 'Guardando...' : modo === 'editar' ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      }
      widthClass="max-w-2xl"
    >
      <form id="coloniaForm" className="grid gap-3" onSubmit={handleSubmit}>
        <InputText
          id="coloniaNombre"
          label="Nombre"
          value={form.nombre}
          onChange={(value) => setForm((prev) => ({ ...prev, nombre: value }))}
          required
        />

        <InputText
          id="coloniaCp"
          label="Codigo postal"
          value={form.codigoPostal}
          onChange={(value) => setForm((prev) => ({ ...prev, codigoPostal: value.replace(/[^0-9]/g, '').slice(0, 5) }))}
          placeholder="Ejemplo: 29000"
          required
        />

        <Select
          id="coloniaCiudad"
          label="Ciudad"
          value={form.idCiudad}
          onChange={(value) => setForm((prev) => ({ ...prev, idCiudad: value }))}
          options={opcionesCiudad}
        />

        <Select
          id="coloniaActivo"
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
