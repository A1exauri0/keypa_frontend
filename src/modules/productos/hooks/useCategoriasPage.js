import { createElement } from 'react';
import useCrudBase from '../../../core/hooks/useCrudBase';
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoriasMultiples,
  listarCategorias,
} from '../services/categoriasService';

export default function useCategoriasPage() {
  const crud = useCrudBase({
    listFn: listarCategorias,
    createFn: crearCategoria,
    updateFn: actualizarCategoria,
    deleteManyFn: eliminarCategoriasMultiples,
    getId: (item) => item.idCategoria,
    initialFilterValue: 'todos',
    filterFn: (item, { q, filterValue }) => {
      const matchBusqueda = !q || item.nombre.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q);
      const matchActivo =
        filterValue === 'todos' ||
        (filterValue === 'activos' && item.activo) ||
        (filterValue === 'inactivos' && !item.activo);

      return matchBusqueda && matchActivo;
    },
    messages: {
      loadErrorTitle: 'No se pudieron cargar categorias',
      loadErrorMessage: 'No fue posible obtener el listado de categorias.',
      createdTitle: 'Categoria creada',
      updatedTitle: 'Categoria actualizada',
      saveErrorTitle: 'No se pudo guardar',
      saveErrorMessage: 'Verifica los datos enviados.',
      deletedManyTitle: 'Categorias eliminadas',
      deletedOneTitle: 'Categoria eliminada',
      deleteErrorTitle: 'No se pudo eliminar',
      deleteErrorMessage: 'Alguna categoria esta en uso por productos.',
      activatedTitle: 'Categoria activada',
      deactivatedTitle: 'Categoria desactivada',
      toggleErrorTitle: 'No se pudo cambiar estado',
      toggleErrorMessage: 'No fue posible cambiar el estado de la categoria.',
    },
  });

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
      render: (row) =>
        createElement(
          'span',
          {
            className: `rounded-full px-2 py-0.5 text-xs font-semibold ${row.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`,
          },
          row.activo ? 'Activo' : 'Inactivo',
        ),
    },
  ];

  return {
    categoriasFiltradas: crud.filteredRows,
    columnas,
    filtro: crud.search,
    setFiltro: crud.setSearch,
    filtroActivo: crud.filterValue,
    setFiltroActivo: crud.setFilterValue,
    cargando: crud.loading,
    guardando: crud.saving,
    modalAbierto: crud.modalOpen,
    modoModal: crud.modalMode,
    categoriaActual: crud.currentItem,
    abrirCrear: crud.openCreate,
    abrirEditarPorId: crud.openEditById,
    onGuardar: crud.saveItem,
    eliminarSeleccionados: crud.deleteMany,
    alternarActivo: crud.toggleActive,
    eliminarUno: crud.deleteOne,
    cargar: crud.loadData,
    cerrarModal: crud.closeModal,
  };
}
