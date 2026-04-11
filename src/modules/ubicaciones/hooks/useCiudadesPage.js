import { createElement } from 'react';
import useCrudBase from '../../../core/hooks/useCrudBase';
import {
  actualizarCiudad,
  crearCiudad,
  eliminarCiudadesMultiples,
  listarCiudades,
} from '../services/ciudadesService';

export default function useCiudadesPage() {
  const crud = useCrudBase({
    listFn: listarCiudades,
    createFn: crearCiudad,
    updateFn: actualizarCiudad,
    deleteManyFn: eliminarCiudadesMultiples,
    getId: (item) => item.idCiudad,
    initialFilterValue: 'todos',
    filterFn: (item, { q, filterValue }) => {
      const matchBusqueda = !q || item.nombre.toLowerCase().includes(q) || (item.estado || '').toLowerCase().includes(q);
      const matchActivo =
        filterValue === 'todos' ||
        (filterValue === 'activos' && item.activo) ||
        (filterValue === 'inactivos' && !item.activo);

      return matchBusqueda && matchActivo;
    },
    messages: {
      loadErrorTitle: 'No se pudieron cargar ciudades',
      loadErrorMessage: 'No fue posible obtener el listado de ciudades.',
      createdTitle: 'Ciudad creada',
      updatedTitle: 'Ciudad actualizada',
      saveErrorTitle: 'No se pudo guardar',
      saveErrorMessage: 'Verifica los datos enviados.',
      deletedManyTitle: 'Ciudades eliminadas',
      deletedOneTitle: 'Ciudad eliminada',
      deleteErrorTitle: 'No se pudo eliminar',
      deleteErrorMessage: 'No fue posible eliminar la ciudad.',
      activatedTitle: 'Ciudad activada',
      deactivatedTitle: 'Ciudad desactivada',
      toggleErrorTitle: 'No se pudo cambiar estado',
      toggleErrorMessage: 'No fue posible cambiar el estado de la ciudad.',
    },
  });

  const columnas = [
    { key: 'nombre', label: 'Ciudad' },
    { key: 'estado', label: 'Estado' },
    {
      key: 'activo',
      label: 'Estatus',
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
    ciudadesFiltradas: crud.filteredRows,
    columnas,
    filtro: crud.search,
    setFiltro: crud.setSearch,
    filtroActivo: crud.filterValue,
    setFiltroActivo: crud.setFilterValue,
    cargando: crud.loading,
    guardando: crud.saving,
    modalAbierto: crud.modalOpen,
    modoModal: crud.modalMode,
    ciudadActual: crud.currentItem,
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
