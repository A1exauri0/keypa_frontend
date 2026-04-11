import { createElement } from 'react';
import useCrudBase from '../../../core/hooks/useCrudBase';
import {
  actualizarMarca,
  crearMarca,
  eliminarMarcasMultiples,
  listarMarcas,
} from '../services/marcasService';

export default function useMarcasPage() {
  const crud = useCrudBase({
    listFn: listarMarcas,
    createFn: crearMarca,
    updateFn: actualizarMarca,
    deleteManyFn: eliminarMarcasMultiples,
    getId: (item) => item.idMarca,
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
      loadErrorTitle: 'No se pudieron cargar marcas',
      loadErrorMessage: 'No fue posible obtener el listado de marcas.',
      createdTitle: 'Marca creada',
      updatedTitle: 'Marca actualizada',
      saveErrorTitle: 'No se pudo guardar',
      saveErrorMessage: 'Verifica los datos enviados.',
      deletedManyTitle: 'Marcas eliminadas',
      deletedOneTitle: 'Marca eliminada',
      deleteErrorTitle: 'No se pudo eliminar',
      deleteErrorMessage: 'Alguna marca esta en uso por productos.',
      activatedTitle: 'Marca activada',
      deactivatedTitle: 'Marca desactivada',
      toggleErrorTitle: 'No se pudo cambiar estado',
      toggleErrorMessage: 'No fue posible cambiar el estado de la marca.',
    },
  });

  const columnas = [
    { key: 'nombre', label: 'Nombre' },
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
            className: `rounded-full px-2 py-0.5 text-xs font-semibold ${row.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-red-200 text-red-600'}`,
          },
          row.activo ? 'Activo' : 'Inactivo',
        ),
    },
  ];

  return {
    marcasFiltradas: crud.filteredRows,
    columnas,
    filtro: crud.search,
    setFiltro: crud.setSearch,
    filtroActivo: crud.filterValue,
    setFiltroActivo: crud.setFilterValue,
    cargando: crud.loading,
    guardando: crud.saving,
    modalAbierto: crud.modalOpen,
    modoModal: crud.modalMode,
    marcaActual: crud.currentItem,
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
