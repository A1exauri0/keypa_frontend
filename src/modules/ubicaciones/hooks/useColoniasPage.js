import { createElement, useMemo } from 'react';
import useCrudBase from '../../../core/hooks/useCrudBase';
import {
  actualizarColonia,
  crearColonia,
  eliminarColoniasMultiples,
  listarColonias,
} from '../services/coloniasService';
import { listarCiudades } from '../services/ciudadesService';

export default function useColoniasPage() {
  const crud = useCrudBase({
    listFn: listarColonias,
    createFn: crearColonia,
    updateFn: actualizarColonia,
    deleteManyFn: eliminarColoniasMultiples,
    loadExtras: async () => ({
      ciudades: await listarCiudades(),
    }),
    getId: (item) => item.idColonia,
    initialFilterValue: 'todos',
    filterFn: (item, { q, filterValue }) => {
      const matchBusqueda =
        !q ||
        item.nombre.toLowerCase().includes(q) ||
        item.codigoPostal.toLowerCase().includes(q) ||
        (item.ciudad?.nombre || '').toLowerCase().includes(q);

      const matchCiudad = filterValue === 'todos' || String(item.idCiudad || item.ciudad?.idCiudad) === filterValue;
      return matchBusqueda && matchCiudad;
    },
    messages: {
      loadErrorTitle: 'No se pudieron cargar colonias',
      loadErrorMessage: 'No fue posible obtener el listado de colonias.',
      createdTitle: 'Colonia creada',
      updatedTitle: 'Colonia actualizada',
      saveErrorTitle: 'No se pudo guardar',
      saveErrorMessage: 'Verifica los datos enviados.',
      deletedManyTitle: 'Colonias eliminadas',
      deletedOneTitle: 'Colonia eliminada',
      deleteErrorTitle: 'No se pudo eliminar',
      deleteErrorMessage: 'No fue posible eliminar la colonia.',
      activatedTitle: 'Colonia activada',
      deactivatedTitle: 'Colonia desactivada',
      toggleErrorTitle: 'No se pudo cambiar estado',
      toggleErrorMessage: 'No fue posible cambiar el estado de la colonia.',
    },
  });

  const ciudades = crud.extras.ciudades || [];

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

  const opcionesCiudad = useMemo(
    () => [
      { value: 'todos', label: 'Todas' },
      ...ciudades.map((item) => ({ value: String(item.idCiudad), label: item.nombre })),
    ],
    [ciudades],
  );

  return {
    coloniasFiltradas: crud.filteredRows,
    columnas,
    opcionesCiudad,
    ciudades,
    filtro: crud.search,
    setFiltro: crud.setSearch,
    filtroCiudad: crud.filterValue,
    setFiltroCiudad: crud.setFilterValue,
    cargando: crud.loading,
    guardando: crud.saving,
    modalAbierto: crud.modalOpen,
    modoModal: crud.modalMode,
    coloniaActual: crud.currentItem,
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
