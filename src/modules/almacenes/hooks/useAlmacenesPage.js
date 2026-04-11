import { createElement } from 'react';
import useCrudBase from '../../../core/hooks/useCrudBase';
import {
  actualizarAlmacen,
  crearAlmacen,
  eliminarAlmacenesMultiples,
  listarAlmacenes,
} from '../services/almacenesService';
import { listarSucursales } from '../../sucursales/services/sucursalesService';

export default function useAlmacenesPage() {
  const crud = useCrudBase({
    listFn: listarAlmacenes,
    createFn: crearAlmacen,
    updateFn: actualizarAlmacen,
    deleteManyFn: eliminarAlmacenesMultiples,
    loadExtras: async () => ({
      sucursales: await listarSucursales(),
    }),
    getId: (item) => item.idAlmacen,
    initialFilterValue: 'todos',
    filterFn: (item, { q, filterValue }) => {
      const matchBusqueda =
        !q ||
        (item.nombre || '').toLowerCase().includes(q) ||
        (item.sucursal?.nombre || '').toLowerCase().includes(q);

      const matchActivo =
        filterValue === 'todos' ||
        (filterValue === 'activos' && item.activo) ||
        (filterValue === 'inactivos' && !item.activo);

      return matchBusqueda && matchActivo;
    },
    messages: {
      loadErrorTitle: 'No se pudieron cargar almacenes',
      loadErrorMessage: 'No fue posible obtener el listado de almacenes.',
      createdTitle: 'Almacén creado',
      updatedTitle: 'Almacén actualizado',
      saveErrorTitle: 'No se pudo guardar',
      saveErrorMessage: 'Verifica los datos enviados.',
      deletedManyTitle: 'Almacenes eliminados',
      deletedOneTitle: 'Almacén eliminado',
      deleteErrorTitle: 'No se pudo eliminar',
      deleteErrorMessage: 'No fue posible eliminar el almacén.',
      activatedTitle: 'Almacén activado',
      deactivatedTitle: 'Almacén desactivado',
      toggleErrorTitle: 'No se pudo cambiar estado',
      toggleErrorMessage: 'No fue posible cambiar el estado del almacén.',
    },
  });

  const sucursales = crud.extras.sucursales || [];

  const columnas = [
    { key: 'nombre', label: 'Almacén' },
    { key: 'sucursal', label: 'Sucursal', render: (row) => row.sucursal?.nombre || '-' },
    {
      key: 'estado',
      label: 'Estado',
      render: (row) =>
        createElement(
          'span',
          {
            className: `inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
              row.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`,
          },
          row.activo ? 'Activo' : 'Inactivo',
        ),
    },
  ];

  return {
    almacenesFiltrados: crud.filteredRows,
    columnas,
    sucursales,
    filtro: crud.search,
    setFiltro: crud.setSearch,
    filtroActivo: crud.filterValue,
    setFiltroActivo: crud.setFilterValue,
    cargando: crud.loading,
    guardando: crud.saving,
    modalAbierto: crud.modalOpen,
    modoModal: crud.modalMode,
    almacenActual: crud.currentItem,
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
