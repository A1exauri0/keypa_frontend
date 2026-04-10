import { useEffect, useMemo, useState } from 'react';
import Crud from '../../../core/components/ui/complex/Crud';
import { useToast } from '../../../core/components/ui/feedback/Toast';
import ColoniaModal from '../components/ColoniaModal';
import {
  actualizarColonia,
  crearColonia,
  eliminarColoniasMultiples,
  listarColonias,
} from '../services/coloniasService';
import { listarCiudades } from '../services/ciudadesService';

export default function ColoniasPage() {
  const { toast } = useToast();
  const [colonias, setColonias] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [filtroCiudad, setFiltroCiudad] = useState('todos');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState('crear');
  const [coloniaActual, setColoniaActual] = useState(null);

  const cargar = async () => {
    setCargando(true);
    try {
      const [coloniasData, ciudadesData] = await Promise.all([
        listarColonias(),
        listarCiudades(),
      ]);

      setColonias(coloniasData);
      setCiudades(ciudadesData);
    } catch (error) {
      toast({
        title: 'No se pudieron cargar colonias',
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

  const coloniasFiltradas = useMemo(() => {
    const q = filtro.trim().toLowerCase();

    return colonias.filter((item) => {
      const matchBusqueda =
        !q ||
        item.nombre.toLowerCase().includes(q) ||
        item.codigoPostal.toLowerCase().includes(q) ||
        (item.ciudad?.nombre || '').toLowerCase().includes(q);

      const matchCiudad =
        filtroCiudad === 'todos' || String(item.idCiudad || item.ciudad?.idCiudad) === filtroCiudad;

      return matchBusqueda && matchCiudad;
    });
  }, [colonias, filtro, filtroCiudad]);

  const columnas = [
    { key: 'nombre', label: 'Colonia' },
    { key: 'codigoPostal', label: 'Codigo postal' },
    {
      key: 'ciudad',
      label: 'Ciudad',
      render: (row) => row.ciudad?.nombre || '-',
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (row) => row.ciudad?.estado || '-',
    },
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

  const opcionesCiudad = useMemo(
    () => [
      { value: 'todos', label: 'Todas' },
      ...ciudades.map((item) => ({ value: String(item.idCiudad), label: item.nombre })),
    ],
    [ciudades],
  );

  const abrirCrear = () => {
    setModoModal('crear');
    setColoniaActual(null);
    setModalAbierto(true);
  };

  const abrirEditarPorId = (idColonia) => {
    const colonia = colonias.find((item) => item.idColonia === idColonia);
    if (!colonia) {
      return;
    }

    setModoModal('editar');
    setColoniaActual(colonia);
    setModalAbierto(true);
  };

  const onGuardar = async (payload) => {
    setGuardando(true);
    try {
      if (modoModal === 'editar' && coloniaActual) {
        await actualizarColonia(coloniaActual.idColonia, payload);
        toast({ title: 'Colonia actualizada', variant: 'success' });
      } else {
        await crearColonia(payload);
        toast({ title: 'Colonia creada', variant: 'success' });
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
      await eliminarColoniasMultiples(ids);
      toast({ title: 'Colonias eliminadas', variant: 'warning' });
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

  const alternarActivo = async (colonia) => {
    try {
      await actualizarColonia(colonia.idColonia, { activo: !colonia.activo });
      toast({ title: colonia.activo ? 'Colonia desactivada' : 'Colonia activada', variant: 'success' });
      await cargar();
    } catch (error) {
      toast({
        title: 'No se pudo cambiar estado',
        message: error.response?.data?.message,
        variant: 'danger',
      });
    }
  };

  const eliminarUno = async (idColonia) => {
    try {
      await eliminarColoniasMultiples([idColonia]);
      toast({ title: 'Colonia eliminada', variant: 'warning' });
      await cargar();
    } catch (error) {
      toast({
        title: 'No se pudo eliminar',
        message: error.response?.data?.message || 'No fue posible eliminar la colonia.',
        variant: 'danger',
      });
    }
  };

  return (
    <section className="grid gap-6">
      <Crud
        title="Colonias"
        description="Listado de colonias con acciones por seleccion."
        rows={coloniasFiltradas}
        columns={columnas}
        loading={cargando}
        getRowId={(row) => row.idColonia}
        searchLabel="Buscar colonia"
        searchPlaceholder="Nombre, CP o ciudad"
        searchValue={filtro}
        onSearchChange={setFiltro}
        filterLabel="Ciudad"
        filterValue={filtroCiudad}
        onFilterChange={setFiltroCiudad}
        filterOptions={opcionesCiudad}
        createLabel="Agregar colonia"
        onCreate={abrirCrear}
        onRefresh={cargar}
        onEdit={abrirEditarPorId}
        onDeleteOne={eliminarUno}
        onToggleActive={alternarActivo}
        onDeleteMany={eliminarSeleccionados}
      />

      <ColoniaModal
        open={modalAbierto}
        modo={modoModal}
        colonia={coloniaActual}
        ciudades={ciudades}
        loading={guardando}
        onClose={() => setModalAbierto(false)}
        onSubmit={onGuardar}
      />
    </section>
  );
}
