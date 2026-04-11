import Crud from '../../../core/components/ui/complex/Crud';
import CiudadModal from '../components/CiudadModal';
import useCiudadesPage from '../hooks/useCiudadesPage';

export default function CiudadesPage() {
  const {
    ciudadesFiltradas,
    columnas,
    filtro,
    setFiltro,
    filtroActivo,
    setFiltroActivo,
    cargando,
    guardando,
    modalAbierto,
    modoModal,
    ciudadActual,
    abrirCrear,
    abrirEditarPorId,
    onGuardar,
    eliminarSeleccionados,
    alternarActivo,
    eliminarUno,
    cargar,
    cerrarModal,
  } = useCiudadesPage();

  return (
    <section className="grid gap-6">
      <Crud
        title="Ciudades"
        description="Listado de ciudades con acciones por seleccion."
        rows={ciudadesFiltradas}
        columns={columnas}
        loading={cargando}
        getRowId={(row) => row.idCiudad}
        searchLabel="Buscar ciudad"
        searchPlaceholder="Nombre o estado"
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
        createLabel="Agregar ciudad"
        onCreate={abrirCrear}
        onRefresh={cargar}
        onEdit={abrirEditarPorId}
        onDeleteOne={eliminarUno}
        onToggleActive={alternarActivo}
        onDeleteMany={eliminarSeleccionados}
      />

      <CiudadModal
        open={modalAbierto}
        modo={modoModal}
        ciudad={ciudadActual}
        loading={guardando}
        onClose={cerrarModal}
        onSubmit={onGuardar}
      />
    </section>
  );
}
