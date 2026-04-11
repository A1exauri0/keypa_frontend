import { createElement } from 'react';
import useCrudBase from '../../../core/hooks/useCrudBase';
import {
  actualizarSucursal,
  crearSucursal,
  eliminarSucursalesMultiples,
  listarSucursales,
} from '../services/sucursalesService';
import { listarCiudades } from '../../ubicaciones/services/ciudadesService';
import { listarColonias } from '../../ubicaciones/services/coloniasService';

export default function useSucursalesPage() {
  const crud = useCrudBase({
    listFn: listarSucursales,
    createFn: crearSucursal,
    updateFn: actualizarSucursal,
    deleteManyFn: eliminarSucursalesMultiples,
    loadExtras: async () => ({
      ciudades: await listarCiudades(),
      colonias: await listarColonias(),
    }),
    getId: (item) => item.idSucursal,
    initialFilterValue: 'todos',
    filterFn: (item, { q, filterValue }) => {
      const matchBusqueda =
        !q ||
        (item.nombre || '').toLowerCase().includes(q) ||
        (item.telefono || '').toLowerCase().includes(q) ||
        (item.email || '').toLowerCase().includes(q) ||
        (item.ciudad?.nombre || '').toLowerCase().includes(q);

      const matchActivo =
        filterValue === 'todos' ||
        (filterValue === 'activos' && item.activo) ||
        (filterValue === 'inactivos' && !item.activo);

      return matchBusqueda && matchActivo;
    },
    messages: {
      loadErrorTitle: 'No se pudieron cargar sucursales',
      loadErrorMessage: 'No fue posible obtener el listado de sucursales.',
      createdTitle: 'Sucursal creada',
      updatedTitle: 'Sucursal actualizada',
      saveErrorTitle: 'No se pudo guardar',
      saveErrorMessage: 'Verifica los datos enviados.',
      deletedManyTitle: 'Sucursales eliminadas',
      deletedOneTitle: 'Sucursal eliminada',
      deleteErrorTitle: 'No se pudo eliminar',
      deleteErrorMessage: 'No fue posible eliminar la sucursal.',
      activatedTitle: 'Sucursal activada',
      deactivatedTitle: 'Sucursal desactivada',
      toggleErrorTitle: 'No se pudo cambiar estado',
      toggleErrorMessage: 'No fue posible cambiar el estado de la sucursal.',
    },
  });

  const ciudades = crud.extras.ciudades || [];
  const colonias = crud.extras.colonias || [];

  const columnas = [
    { key: 'nombre', label: 'Sucursal' },
    { key: 'telefono', label: 'Telefono' },
    { key: 'email', label: 'Email', render: (row) => row.email || '-' },
    { key: 'encargado', label: 'Encargado', render: (row) => row.encargado || '-' },
    {
      key: 'ubicacion',
      label: 'Ubicacion',
      render: (row) => `${row.ciudad?.nombre || '-'} / ${row.colonia?.nombre || '-'}`,
    },
    {
      key: 'almacenes',
      label: 'Almacenes',
      render: (row) => row._count?.almacenes ?? 0,
    },
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
    sucursalesFiltradas: crud.filteredRows,
    columnas,
    ciudades,
    colonias,
    filtro: crud.search,
    setFiltro: crud.setSearch,
    filtroActivo: crud.filterValue,
    setFiltroActivo: crud.setFilterValue,
    cargando: crud.loading,
    guardando: crud.saving,
    modalAbierto: crud.modalOpen,
    modoModal: crud.modalMode,
    sucursalActual: crud.currentItem,
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
