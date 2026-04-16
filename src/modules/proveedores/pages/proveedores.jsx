import Crud from '../../../core/components/ui/complex/Crud';
import ProveedorModal from '../components/ProveedorModal';
import useProveedoresPage from '../hooks/useProveedoresPage';

export default function ProveedoresPage() {
  const {
    proveedoresFiltrados,
    columnas,
    filtro,
    setFiltro,
    filtroActivo,
    setFiltroActivo,
    cargando,
    guardando,
    modalAbierto,
    modoModal,
    proveedorActual,
    abrirCrear,
    abrirEditarPorId,
    onGuardar,
    eliminarSeleccionados,
    alternarActivo,
    eliminarUno,
    cargar,
    cerrarModal,
  } = useProveedoresPage();

  return (
    <section className="grid gap-6">
      <Crud
        title="Proveedores"
        description="Listado de proveedores para compras de producto."
        rows={proveedoresFiltrados}
        columns={columnas}
        loading={cargando}
        getRowId={(row) => row.idProveedor}
        searchLabel="Buscar proveedor"
        searchPlaceholder="Nombre, contacto, telefono o email"
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
        createLabel="Agregar proveedor"
        onCreate={abrirCrear}
        onRefresh={cargar}
        onEdit={abrirEditarPorId}
        onDeleteOne={eliminarUno}
        onToggleActive={alternarActivo}
        onDeleteMany={eliminarSeleccionados}
      />

      <ProveedorModal
        open={modalAbierto}
        modo={modoModal}
        proveedor={proveedorActual}
        loading={guardando}
        onClose={cerrarModal}
        onSubmit={onGuardar}
      />
    </section>
  );
}
