import { createElement } from 'react';
import useCrudBase from '../../../core/hooks/useCrudBase';
import {
  actualizarCliente,
  crearCliente,
  eliminarClientesMultiples,
  listarClientes,
} from '../services/clientesService';
import { listarCiudades } from '../../ubicaciones/services/ciudadesService';
import { listarColonias } from '../../ubicaciones/services/coloniasService';

export default function useClientesPage() {
  const crud = useCrudBase({
    listFn: listarClientes,
    createFn: crearCliente,
    updateFn: actualizarCliente,
    deleteManyFn: eliminarClientesMultiples,
    loadExtras: async () => ({
      ciudades: await listarCiudades(),
      colonias: await listarColonias(),
    }),
    getId: (item) => item.idCliente,
    initialFilterValue: 'todos',
    filterFn: (item, { q, filterValue }) => {
      const nombreCompleto = `${item.nombre || ''} ${item.apellidos || ''}`.toLowerCase();
      const matchBusqueda =
        !q ||
        nombreCompleto.includes(q) ||
        (item.email || '').toLowerCase().includes(q) ||
        (item.telefono || '').toLowerCase().includes(q) ||
        (item.ciudad?.nombre || '').toLowerCase().includes(q);

      const matchActivo =
        filterValue === 'todos' ||
        (filterValue === 'activos' && item.activo) ||
        (filterValue === 'inactivos' && !item.activo);

      return matchBusqueda && matchActivo;
    },
    messages: {
      loadErrorTitle: 'No se pudieron cargar clientes',
      loadErrorMessage: 'No fue posible obtener el listado de clientes.',
      createdTitle: 'Cliente creado',
      updatedTitle: 'Cliente actualizado',
      saveErrorTitle: 'No se pudo guardar',
      saveErrorMessage: 'Verifica los datos enviados.',
      deletedManyTitle: 'Clientes eliminados',
      deletedOneTitle: 'Cliente eliminado',
      deleteErrorTitle: 'No se pudo eliminar',
      deleteErrorMessage: 'No fue posible eliminar el cliente.',
      activatedTitle: 'Cliente activado',
      deactivatedTitle: 'Cliente desactivado',
      toggleErrorTitle: 'No se pudo cambiar estado',
      toggleErrorMessage: 'No fue posible cambiar el estado del cliente.',
    },
  });

  const ciudades = crud.extras.ciudades || [];
  const colonias = crud.extras.colonias || [];

  const columnas = [
    {
      key: 'nombre',
      label: 'Cliente',
      render: (row) => `${row.nombre} ${row.apellidos}`,
    },
    { key: 'email', label: 'Email', render: (row) => row.email || '-' },
    { key: 'telefono', label: 'Telefono' },
    { key: 'genero', label: 'Genero', render: (row) => row.genero || '-' },
    {
      key: 'ubicacion',
      label: 'Ubicacion',
      render: (row) => `${row.ciudad?.nombre || '-'} / ${row.colonia?.nombre || '-'}`,
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
    clientesFiltrados: crud.filteredRows,
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
    clienteActual: crud.currentItem,
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
