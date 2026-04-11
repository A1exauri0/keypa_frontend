import Crud from '../../../core/components/ui/complex/Crud';
import SucursalModal from '../components/SucursalModal';
import useSucursalesPage from '../hooks/useSucursalesPage';

export default function SucursalesPage() {
  const {
    sucursalesFiltradas,
    columnas,
    ciudades,
    colonias,
    filtro,
    setFiltro,
    filtroActivo,
    setFiltroActivo,
    cargando,
    guardando,
    modalAbierto,
    modoModal,
    sucursalActual,
    abrirCrear,
    abrirEditarPorId,
    onGuardar,
    eliminarSeleccionados,
    alternarActivo,
    eliminarUno,
    cargar,
    cerrarModal,
  } = useSucursalesPage();

  return (
    <section className="grid gap-6">
      <Crud
        title="Sucursales"
        description="Listado de sucursales con administracion de estado y ubicacion."
        rows={sucursalesFiltradas}
        columns={columnas}
        loading={cargando}
        getRowId={(row) => row.idSucursal}
        searchLabel="Buscar sucursal"
        searchPlaceholder="Nombre, telefono, email o ciudad"
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
        createLabel="Agregar sucursal"
        onCreate={abrirCrear}
        onRefresh={cargar}
        onEdit={abrirEditarPorId}
        onDeleteOne={eliminarUno}
        onToggleActive={alternarActivo}
        onDeleteMany={eliminarSeleccionados}
      />

      <SucursalModal
        open={modalAbierto}
        modo={modoModal}
        sucursal={sucursalActual}
        ciudades={ciudades}
        colonias={colonias}
        loading={guardando}
        onClose={cerrarModal}
        onSubmit={onGuardar}
      />
    </section>
  );
}
