import { useEffect, useMemo, useState } from 'react';
import Modal from '../../../core/components/ui/overlays/Modal';
import Button from '../../../core/components/ui/buttons/Button';
import InputText from '../../../core/components/ui/inputs/InputText';
import Select from '../../../core/components/ui/selectors/Select';

const estadoInicial = {
  nombre: '',
  telefono: '',
  email: '',
  encargado: '',
  direccion: '',
  numeroExterior: '',
  numeroInterior: '',
  referencias: '',
  codigoPostal: '',
  idCiudad: '',
  idColonia: '',
  activo: true,
};

export default function SucursalModal({
  open,
  modo,
  sucursal,
  ciudades = [],
  colonias = [],
  loading,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(estadoInicial);

  const opcionesCiudad = useMemo(
    () => ciudades.map((item) => ({ value: String(item.idCiudad), label: item.nombre })),
    [ciudades],
  );

  const coloniasFiltradas = useMemo(() => {
    if (!form.idCiudad) {
      return [];
    }

    return colonias.filter((item) => String(item.idCiudad || item.ciudad?.idCiudad) === String(form.idCiudad));
  }, [colonias, form.idCiudad]);

  const opcionesColonia = useMemo(
    () =>
      coloniasFiltradas.map((item) => ({
        value: String(item.idColonia),
        label: `${item.nombre} (${item.codigoPostal})`,
      })),
    [coloniasFiltradas],
  );

  useEffect(() => {
    if (open) {
      setForm(
        sucursal
          ? {
              nombre: sucursal.nombre || '',
              telefono: sucursal.telefono || '',
              email: sucursal.email || '',
              encargado: sucursal.encargado || '',
              direccion: sucursal.direccion || '',
              numeroExterior: sucursal.numeroExterior || '',
              numeroInterior: sucursal.numeroInterior || '',
              referencias: sucursal.referencias || '',
              codigoPostal: sucursal.codigoPostal || '',
              idCiudad: sucursal.idCiudad ? String(sucursal.idCiudad) : '',
              idColonia: sucursal.idColonia ? String(sucursal.idColonia) : '',
              activo: Boolean(sucursal.activo),
            }
          : estadoInicial,
      );
    }
  }, [open, sucursal]);

  useEffect(() => {
    if (!form.idColonia) {
      return;
    }

    const coloniaValida = coloniasFiltradas.some((item) => String(item.idColonia) === String(form.idColonia));
    if (!coloniaValida) {
      setForm((prev) => ({ ...prev, idColonia: '' }));
    }
  }, [form.idColonia, coloniasFiltradas]);

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim(),
      email: form.email.trim() || null,
      encargado: form.encargado.trim() || null,
      direccion: form.direccion.trim(),
      numeroExterior: form.numeroExterior.trim() || null,
      numeroInterior: form.numeroInterior.trim() || null,
      referencias: form.referencias.trim() || null,
      codigoPostal: form.codigoPostal.trim() || null,
      idCiudad: form.idCiudad ? Number(form.idCiudad) : null,
      idColonia: form.idColonia ? Number(form.idColonia) : null,
      activo: Boolean(form.activo),
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={modo === 'editar' ? 'Actualizar sucursal' : 'Agregar sucursal'}
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="sucursalForm" disabled={loading}>
            {loading ? 'Guardando...' : modo === 'editar' ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      }
      widthClass="max-w-3xl"
    >
      <form id="sucursalForm" className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
        <InputText
          id="sucursalNombre"
          label="Nombre"
          value={form.nombre}
          onChange={(value) => setForm((prev) => ({ ...prev, nombre: value }))}
          required
        />

        <InputText
          id="sucursalTelefono"
          label="Telefono"
          value={form.telefono}
          onChange={(value) => setForm((prev) => ({ ...prev, telefono: value }))}
          required
        />

        <InputText
          id="sucursalEmail"
          label="Email"
          type="email"
          value={form.email}
          onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
        />

        <InputText
          id="sucursalEncargado"
          label="Encargado"
          value={form.encargado}
          onChange={(value) => setForm((prev) => ({ ...prev, encargado: value }))}
        />

        <InputText
          id="sucursalDireccion"
          label="Direccion"
          value={form.direccion}
          onChange={(value) => setForm((prev) => ({ ...prev, direccion: value }))}
          required
        />

        <InputText
          id="sucursalCp"
          label="Codigo postal"
          value={form.codigoPostal}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, codigoPostal: value.replace(/[^0-9]/g, '').slice(0, 5) }))
          }
        />

        <InputText
          id="sucursalNumeroExterior"
          label="Numero exterior"
          value={form.numeroExterior}
          onChange={(value) => setForm((prev) => ({ ...prev, numeroExterior: value }))}
        />

        <InputText
          id="sucursalNumeroInterior"
          label="Numero interior"
          value={form.numeroInterior}
          onChange={(value) => setForm((prev) => ({ ...prev, numeroInterior: value }))}
        />

        <Select
          id="sucursalCiudad"
          label="Ciudad"
          value={form.idCiudad}
          onChange={(value) => setForm((prev) => ({ ...prev, idCiudad: value, idColonia: '' }))}
          options={[{ value: '', label: 'Seleccionar ciudad' }, ...opcionesCiudad]}
        />

        <Select
          id="sucursalColonia"
          label="Colonia"
          value={form.idColonia}
          onChange={(value) => setForm((prev) => ({ ...prev, idColonia: value }))}
          options={[{ value: '', label: 'Seleccionar colonia' }, ...opcionesColonia]}
        />

        <div className="md:col-span-2">
          <InputText
            id="sucursalReferencias"
            label="Referencias"
            value={form.referencias}
            onChange={(value) => setForm((prev) => ({ ...prev, referencias: value }))}
          />
        </div>

        <div className="md:col-span-2">
          <Select
            id="sucursalActivo"
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
