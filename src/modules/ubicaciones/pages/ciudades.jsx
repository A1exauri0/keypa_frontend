import { useEffect, useMemo, useState } from 'react';
import Crud from '../../../core/components/ui/complex/Crud';
import { useToast } from '../../../core/components/ui/feedback/Toast';
import CiudadModal from '../components/CiudadModal';
import {
  actualizarCiudad,
  crearCiudad,
  eliminarCiudadesMultiples,
  listarCiudades,
} from '../services/ciudadesService';

export default function CiudadesPage() {
  const { toast } = useToast();
  const [ciudades, setCiudades] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState('crear');
  const [ciudadActual, setCiudadActual] = useState(null);

  const cargar = async () => {
    setCargando(true);
    try {
      setCiudades(await listarCiudades());
    } catch (error) {
      toast({
        title: 'No se pudieron cargar ciudades',
        message: error.response?.data?.message,
        variant: 'danger',
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const ciudadesFiltradas = useMemo(() => {
    const q = filtro.trim().toLowerCase();

    return ciudades.filter((item) => {
      const matchBusqueda =
        !q ||
        item.nombre.toLowerCase().includes(q) ||
        (item.estado || '').toLowerCase().includes(q);

      const matchActivo =
        filtroActivo === 'todos' ||
        (filtroActivo === 'activos' && item.activo) ||
        (filtroActivo === 'inactivos' && !item.activo);

      return matchBusqueda && matchActivo;
    });
  }, [ciudades, filtro, filtroActivo]);

  const columnas = [
    { key: 'nombre', label: 'Ciudad' },
    { key: 'estado', label: 'Estado' },
    {
      key: 'activo',
      label: 'Estatus',
      render: (row) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${row.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ];

  const abrirCrear = () => {
    setModoModal('crear');
    setCiudadActual(null);
    setModalAbierto(true);
  };

  const abrirEditarPorId = (idCiudad) => {
    const ciudad = ciudades.find((item) => item.idCiudad === idCiudad);
    if (!ciudad) {
      return;
    }

    setModoModal('editar');
    setCiudadActual(ciudad);
    setModalAbierto(true);
  };

  const onGuardar = async (payload) => {
    setGuardando(true);
    try {
      if (modoModal === 'editar' && ciudadActual) {
        await actualizarCiudad(ciudadActual.idCiudad, payload);
        toast({ title: 'Ciudad actualizada', variant: 'success' });
      } else {
        await crearCiudad(payload);
        toast({ title: 'Ciudad creada', variant: 'success' });
      }

      setModalAbierto(false);
      await cargar();
    } catch (error) {
      toast({
        title: 'No se pudo guardar',
        message: error.response?.data?.message || 'Verifica los datos enviados.',
        variant: 'danger',
      });
    } finally {
      setGuardando(false);
    }
  };

  const eliminarSeleccionados = async (ids, onDone) => {
    try {
      await eliminarCiudadesMultiples(ids);
      toast({ title: 'Ciudades eliminadas', variant: 'warning' });
      onDone();
      await cargar();
    } catch (error) {
      toast({
        title: 'No se pudo eliminar',
        message: error.response?.data?.message || 'No fue posible eliminar la seleccion actual.',
        variant: 'danger',
      });
    }
  };

  const alternarActivo = async (ciudad) => {
    try {
      await actualizarCiudad(ciudad.idCiudad, { activo: !ciudad.activo });
      toast({ title: ciudad.activo ? 'Ciudad desactivada' : 'Ciudad activada', variant: 'success' });
      await cargar();
    } catch (error) {
      toast({
        title: 'No se pudo cambiar estado',
        message: error.response?.data?.message,
        variant: 'danger',
      });
    }
  };

  const eliminarUno = async (idCiudad) => {
    try {
      await eliminarCiudadesMultiples([idCiudad]);
      toast({ title: 'Ciudad eliminada', variant: 'warning' });
      await cargar();
    } catch (error) {
      toast({
        title: 'No se pudo eliminar',
        message: error.response?.data?.message || 'No fue posible eliminar la ciudad.',
        variant: 'danger',
      });
    }
  };

  return (
    <section className="grid gap-6">
      <Crud
        title="Ciudades"
        description="Listado de ciudades con acciones por seleccion."
        rows={ciudadesFiltradas}
        columns={columnas}
        loading={cargando}
        getRowId={(row) => row.idCiudad}
        searchLabel="Buscar ciudad"
        searchPlaceholder="Nombre o estado"
        searchValue={filtro}
        onSearchChange={setFiltro}
        filterLabel="Estado"
        filterValue={filtroActivo}
        onFilterChange={setFiltroActivo}
        filterOptions={[
          { value: 'todos', label: 'Todos' },
          { value: 'activos', label: 'Activos' },
          { value: 'inactivos', label: 'Inactivos' },
        ]}
        createLabel="Agregar ciudad"
        onCreate={abrirCrear}
        onRefresh={cargar}
        onEdit={abrirEditarPorId}
        onDeleteOne={eliminarUno}
        onToggleActive={alternarActivo}
        onDeleteMany={eliminarSeleccionados}
      />

      <CiudadModal
        open={modalAbierto}
        modo={modoModal}
        ciudad={ciudadActual}
        loading={guardando}
        onClose={() => setModalAbierto(false)}
        onSubmit={onGuardar}
      />
    </section>
  );
}
