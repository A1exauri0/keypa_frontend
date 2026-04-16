import { createElement } from 'react';
import useCrudBase from '../../../core/hooks/useCrudBase';
import {
  actualizarProveedor,
  crearProveedor,
  eliminarProveedoresMultiples,
  listarProveedores,
} from '../services/proveedoresService';

export default function useProveedoresPage() {
  const crud = useCrudBase({
    listFn: listarProveedores,
    createFn: crearProveedor,
    updateFn: actualizarProveedor,
    deleteManyFn: eliminarProveedoresMultiples,
    getId: (item) => item.idProveedor,
    initialFilterValue: 'todos',
    filterFn: (item, { q, filterValue }) => {
      const matchBusqueda =
        !q ||
        (item.nombre || '').toLowerCase().includes(q) ||
        (item.contactoNombre || '').toLowerCase().includes(q) ||
        (item.telefono || '').toLowerCase().includes(q) ||
        (item.email || '').toLowerCase().includes(q);

      const matchActivo =
        filterValue === 'todos' ||
        (filterValue === 'activos' && item.activo) ||
        (filterValue === 'inactivos' && !item.activo);

      return matchBusqueda && matchActivo;
    },
    messages: {
      loadErrorTitle: 'No se pudieron cargar proveedores',
      loadErrorMessage: 'No fue posible obtener el listado de proveedores.',
      createdTitle: 'Proveedor creado',
      updatedTitle: 'Proveedor actualizado',
      saveErrorTitle: 'No se pudo guardar',
      saveErrorMessage: 'Verifica los datos enviados.',
      deletedManyTitle: 'Proveedores eliminados',
      deletedOneTitle: 'Proveedor eliminado',
      deleteErrorTitle: 'No se pudo eliminar',
      deleteErrorMessage: 'No fue posible eliminar proveedores con compras registradas.',
      activatedTitle: 'Proveedor activado',
      deactivatedTitle: 'Proveedor desactivado',
      toggleErrorTitle: 'No se pudo cambiar estado',
      toggleErrorMessage: 'No fue posible cambiar el estado del proveedor.',
    },
  });

  const columnas = [
    { key: 'nombre', label: 'Proveedor' },
    { key: 'contactoNombre', label: 'Contacto', render: (row) => row.contactoNombre || '-' },
    { key: 'telefono', label: 'Telefono', render: (row) => row.telefono || '-' },
    { key: 'email', label: 'Email', render: (row) => row.email || '-' },
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
    proveedoresFiltrados: crud.filteredRows,
    columnas,
    filtro: crud.search,
    setFiltro: crud.setSearch,
    filtroActivo: crud.filterValue,
    setFiltroActivo: crud.setFilterValue,
    cargando: crud.loading,
    guardando: crud.saving,
    modalAbierto: crud.modalOpen,
    modoModal: crud.modalMode,
    proveedorActual: crud.currentItem,
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
