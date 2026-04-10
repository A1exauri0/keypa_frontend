import { useEffect, useMemo, useState } from 'react';
import Crud from '../../../core/components/ui/Crud';
import { useToast } from '../../../core/components/ui/Toast';
import CategoriaModal from '../components/CategoriaModal';
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoriasMultiples,
  listarCategorias,
} from '../services/categoriasService';

export default function CategoriasPage() {
  const { toast } = useToast();
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState('crear');
  const [categoriaActual, setCategoriaActual] = useState(null);

  const cargar = async () => {
    setCargando(true);
    try {
      setCategorias(await listarCategorias());
    } catch (error) {
      toast({
        title: 'No se pudieron cargar categorias',
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

  const categoriasFiltradas = useMemo(() => {
    const q = filtro.trim().toLowerCase();

    return categorias.filter((item) => {
      const matchBusqueda =
        !q || item.nombre.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q);

      const matchActivo =
        filtroActivo === 'todos' ||
        (filtroActivo === 'activos' && item.activo) ||
        (filtroActivo === 'inactivos' && !item.activo);

      return matchBusqueda && matchActivo;
    });
  }, [categorias, filtro, filtroActivo]);

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
    setCategoriaActual(null);
    setModalAbierto(true);
  };

  const onGuardar = async (payload) => {
    setGuardando(true);
    try {
      if (modoModal === 'editar' && categoriaActual) {
        await actualizarCategoria(categoriaActual.idCategoria, payload);
        toast({ title: 'Categoria actualizada', variant: 'success' });
      } else {
        await crearCategoria(payload);
        toast({ title: 'Categoria creada', variant: 'success' });
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
      await eliminarCategoriasMultiples(ids);
      toast({ title: 'Categorias eliminadas', variant: 'warning' });
      onDone();
      await cargar();
    } catch (error) {
      toast({
        title: 'No se pudo eliminar',
        message: error.response?.data?.message || 'Alguna categoria esta en uso por productos.',
        variant: 'danger',
      });
    }
  };

  const abrirEditarPorId = (idCategoria) => {
    const categoria = categorias.find((item) => item.idCategoria === idCategoria);
    if (!categoria) {
      return;
    }

    setModoModal('editar');
    setCategoriaActual(categoria);
    setModalAbierto(true);
  };

  const alternarActivo = async (categoria) => {
    try {
      await actualizarCategoria(categoria.idCategoria, { activo: !categoria.activo });
      toast({ title: categoria.activo ? 'Categoria desactivada' : 'Categoria activada', variant: 'success' });
      await cargar();
    } catch (error) {
      toast({
        title: 'No se pudo cambiar estado',
        message: error.response?.data?.message,
        variant: 'danger',
      });
    }
  };

  const eliminarUno = async (idCategoria) => {
    try {
      await eliminarCategoriasMultiples([idCategoria]);
      toast({ title: 'Categoria eliminada', variant: 'warning' });
      await cargar();
    } catch (error) {
      toast({
        title: 'No se pudo eliminar',
        message: error.response?.data?.message || 'Alguna categoria esta en uso por productos.',
        variant: 'danger',
      });
    }
  };

  return (
    <section className="grid gap-6">
      <Crud
        title="Categorias"
        description="Listado de categorias con acciones por seleccion."
        rows={categoriasFiltradas}
        columns={columnas}
        loading={cargando}
        getRowId={(row) => row.idCategoria}
        searchLabel="Buscar categoria"
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
        createLabel="Agregar categoria"
        onCreate={abrirCrear}
        onRefresh={cargar}
        onEdit={abrirEditarPorId}
        onDeleteOne={eliminarUno}
        onToggleActive={alternarActivo}
        onDeleteMany={eliminarSeleccionados}
      />

      <CategoriaModal
        open={modalAbierto}
        modo={modoModal}
        categoria={categoriaActual}
        loading={guardando}
        onClose={() => setModalAbierto(false)}
        onSubmit={onGuardar}
      />
    </section>
  );
}
