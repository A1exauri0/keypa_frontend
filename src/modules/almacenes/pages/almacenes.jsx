import Crud from '../../../core/components/ui/complex/Crud';
import AlmacenModal from '../components/AlmacenModal';
import useAlmacenesPage from '../hooks/useAlmacenesPage';

export default function AlmacenesPage() {
  const {
    almacenesFiltrados,
    columnas,
    sucursales,
    filtro,
    setFiltro,
    filtroActivo,
    setFiltroActivo,
    cargando,
    guardando,
    modalAbierto,
    modoModal,
    almacenActual,
    abrirCrear,
    abrirEditarPorId,
    onGuardar,
    eliminarSeleccionados,
    alternarActivo,
    eliminarUno,
    cargar,
    cerrarModal,
  } = useAlmacenesPage();

  return (
    <section className="grid gap-6">
      <Crud
        title="Almacenes"
        description="Listado de almacenes vinculados a sucursales."
        rows={almacenesFiltrados}
        columns={columnas}
        loading={cargando}
        getRowId={(row) => row.idAlmacen}
        searchLabel="Buscar almacén"
        searchPlaceholder="Nombre o sucursal"
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
        createLabel="Agregar almacén"
        onCreate={abrirCrear}
        onRefresh={cargar}
        onEdit={abrirEditarPorId}
        onDeleteOne={eliminarUno}
        onToggleActive={alternarActivo}
        onDeleteMany={eliminarSeleccionados}
      />

      <AlmacenModal
        open={modalAbierto}
        modo={modoModal}
        almacen={almacenActual}
        sucursales={sucursales.filter((item) => item.activo)}
        loading={guardando}
        onClose={cerrarModal}
        onSubmit={onGuardar}
      />
    </section>
  );
}
