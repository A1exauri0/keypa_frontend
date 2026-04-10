import { useEffect, useMemo, useState } from 'react';
import Modal from '../../../core/components/ui/overlays/Modal';
import Button from '../../../core/components/ui/buttons/Button';
import InputText from '../../../core/components/ui/inputs/InputText';
import Select from '../../../core/components/ui/selectors/Select';

const estadoInicial = {
  nombre: '',
  apellidos: '',
  email: '',
  telefono: '',
  fechaNacimiento: '',
  genero: '',
  direccion: '',
  numeroExterior: '',
  numeroInterior: '',
  referencias: '',
  codigoPostal: '',
  idCiudad: '',
  idColonia: '',
  activo: true,
};

export default function ClienteModal({
  open,
  modo,
  cliente,
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
        cliente
          ? {
              nombre: cliente.nombre || '',
              apellidos: cliente.apellidos || '',
              email: cliente.email || '',
              telefono: cliente.telefono || '',
              fechaNacimiento: cliente.fechaNacimiento ? String(cliente.fechaNacimiento).slice(0, 10) : '',
              genero: cliente.genero || '',
              direccion: cliente.direccion || '',
              numeroExterior: cliente.numeroExterior || '',
              numeroInterior: cliente.numeroInterior || '',
              referencias: cliente.referencias || '',
              codigoPostal: cliente.codigoPostal || '',
              idCiudad: cliente.idCiudad ? String(cliente.idCiudad) : '',
              idColonia: cliente.idColonia ? String(cliente.idColonia) : '',
              activo: Boolean(cliente.activo),
            }
          : estadoInicial,
      );
    }
  }, [open, cliente]);

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
      apellidos: form.apellidos.trim(),
      email: form.email.trim() || null,
      telefono: form.telefono.trim(),
      fechaNacimiento: form.fechaNacimiento || null,
      genero: form.genero || null,
      direccion: form.direccion.trim() || null,
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
      title={modo === 'editar' ? 'Actualizar cliente' : 'Agregar cliente'}
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="clienteForm" disabled={loading}>
            {loading ? 'Guardando...' : modo === 'editar' ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      }
      widthClass="max-w-3xl"
    >
      <form id="clienteForm" className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
        <InputText
          id="clienteNombre"
          label="Nombre"
          value={form.nombre}
          onChange={(value) => setForm((prev) => ({ ...prev, nombre: value }))}
          required
        />

        <InputText
          id="clienteApellidos"
          label="Apellidos"
          value={form.apellidos}
          onChange={(value) => setForm((prev) => ({ ...prev, apellidos: value }))}
          required
        />

        <InputText
          id="clienteEmail"
          label="Email"
          type="email"
          value={form.email}
          onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
        />

        <InputText
          id="clienteTelefono"
          label="Telefono"
          value={form.telefono}
          onChange={(value) => setForm((prev) => ({ ...prev, telefono: value }))}
          required
        />

        <InputText
          id="clienteFechaNacimiento"
          label="Fecha nacimiento"
          type="date"
          value={form.fechaNacimiento}
          onChange={(value) => setForm((prev) => ({ ...prev, fechaNacimiento: value }))}
          allowSpecialChars
        />

        <Select
          id="clienteGenero"
          label="Genero"
          value={form.genero}
          onChange={(value) => setForm((prev) => ({ ...prev, genero: value }))}
          options={[
            { value: '', label: 'Sin especificar' },
            { value: 'Masculino', label: 'Masculino' },
            { value: 'Femenino', label: 'Femenino' },
          ]}
        />

        <InputText
          id="clienteDireccion"
          label="Direccion"
          value={form.direccion}
          onChange={(value) => setForm((prev) => ({ ...prev, direccion: value }))}
        />

        <InputText
          id="clienteCp"
          label="Codigo postal"
          value={form.codigoPostal}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, codigoPostal: value.replace(/[^0-9]/g, '').slice(0, 5) }))
          }
        />

        <InputText
          id="clienteNumeroExterior"
          label="Numero exterior"
          value={form.numeroExterior}
          onChange={(value) => setForm((prev) => ({ ...prev, numeroExterior: value }))}
        />

        <InputText
          id="clienteNumeroInterior"
          label="Numero interior"
          value={form.numeroInterior}
          onChange={(value) => setForm((prev) => ({ ...prev, numeroInterior: value }))}
        />

        <Select
          id="clienteCiudad"
          label="Ciudad"
          value={form.idCiudad}
          onChange={(value) => setForm((prev) => ({ ...prev, idCiudad: value, idColonia: '' }))}
          options={[{ value: '', label: 'Seleccionar ciudad' }, ...opcionesCiudad]}
        />

        <Select
          id="clienteColonia"
          label="Colonia"
          value={form.idColonia}
          onChange={(value) => setForm((prev) => ({ ...prev, idColonia: value }))}
          options={[{ value: '', label: 'Seleccionar colonia' }, ...opcionesColonia]}
        />

        <div className="md:col-span-2">
          <InputText
            id="clienteReferencias"
            label="Referencias"
            value={form.referencias}
            onChange={(value) => setForm((prev) => ({ ...prev, referencias: value }))}
          />
        </div>

        <div className="md:col-span-2">
          <Select
            id="clienteActivo"
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
