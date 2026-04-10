import { useEffect, useMemo, useState } from 'react';
import Crud from '../../../core/components/ui/Crud';
import { useToast } from '../../../core/components/ui/Toast';
import MarcaModal from '../components/MarcaModal';
import {
  actualizarMarca,
  crearMarca,
  eliminarMarcasMultiples,
  listarMarcas,
} from '../services/marcasService';

export default function MarcasPage() {
  const { toast } = useToast();
  const [marcas, setMarcas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState('crear');
  const [marcaActual, setMarcaActual] = useState(null);

  const cargar = async () => {
    setCargando(true);
    try {
      setMarcas(await listarMarcas());
    } catch (error) {
      toast({
        title: 'No se pudieron cargar marcas',
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

  const marcasFiltradas = useMemo(() => {
    const q = filtro.trim().toLowerCase();

    return marcas.filter((item) => {
      const matchBusqueda =
        !q || item.nombre.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q);

      const matchActivo =
        filtroActivo === 'todos' ||
        (filtroActivo === 'activos' && item.activo) ||
        (filtroActivo === 'inactivos' && !item.activo);

      return matchBusqueda && matchActivo;
    });
  }, [marcas, filtro, filtroActivo]);

  const columnas = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'slug', label: 'Slug' },
    {
      key: 'descripcion',
      label: 'Descripcion',
      render: (row) => row.descripcion || '-',
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (row) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${row.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ];

  const abrirCrear = () => {
    setModoModal('crear');
    setMarcaActual(null);
    setModalAbierto(true);
  };

  const onGuardar = async (payload) => {
    setGuardando(true);
    try {
      if (modoModal === 'editar' && marcaActual) {
        await actualizarMarca(marcaActual.idMarca, payload);
        toast({ title: 'Marca actualizada', variant: 'success' });
      } else {
        await crearMarca(payload);
        toast({ title: 'Marca creada', variant: 'success' });
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
      await eliminarMarcasMultiples(ids);
      toast({ title: 'Marcas eliminadas', variant: 'warning' });
      onDone();
      await cargar();
    } catch (error) {
      toast({
        title: 'No se pudo eliminar',
        message: error.response?.data?.message || 'Alguna marca esta en uso por productos.',
        variant: 'danger',
      });
    }
  };

  const abrirEditarPorId = (idMarca) => {
    const marca = marcas.find((item) => item.idMarca === idMarca);
    if (!marca) {
      return;
    }

    setModoModal('editar');
    setMarcaActual(marca);
    setModalAbierto(true);
  };

  const alternarActivo = async (marca) => {
    try {
      await actualizarMarca(marca.idMarca, { activo: !marca.activo });
      toast({ title: marca.activo ? 'Marca desactivada' : 'Marca activada', variant: 'success' });
      await cargar();
    } catch (error) {
      toast({
        title: 'No se pudo cambiar estado',
        message: error.response?.data?.message,
        variant: 'danger',
      });
    }
  };

  const eliminarUno = async (idMarca) => {
    try {
      await eliminarMarcasMultiples([idMarca]);
      toast({ title: 'Marca eliminada', variant: 'warning' });
      await cargar();
    } catch (error) {
      toast({
        title: 'No se pudo eliminar',
        message: error.response?.data?.message || 'Alguna marca esta en uso por productos.',
        variant: 'danger',
      });
    }
  };

  return (
    <section className="grid gap-6">
      <Crud
        title="Marcas"
        description="Listado de marcas con acciones por seleccion."
        rows={marcasFiltradas}
        columns={columnas}
        loading={cargando}
        getRowId={(row) => row.idMarca}
        searchLabel="Buscar marca"
        searchPlaceholder="Nombre o slug"
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
        createLabel="Agregar marca"
        onCreate={abrirCrear}
        onRefresh={cargar}
        onEdit={abrirEditarPorId}
        onDeleteOne={eliminarUno}
        onToggleActive={alternarActivo}
        onDeleteMany={eliminarSeleccionados}
      />

      <MarcaModal
        open={modalAbierto}
        modo={modoModal}
        marca={marcaActual}
        loading={guardando}
        onClose={() => setModalAbierto(false)}
        onSubmit={onGuardar}
      />
    </section>
  );
}
