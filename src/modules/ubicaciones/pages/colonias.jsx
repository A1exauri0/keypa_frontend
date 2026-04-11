import Crud from '../../../core/components/ui/complex/Crud';
import ColoniaModal from '../components/ColoniaModal';
import useColoniasPage from '../hooks/useColoniasPage';

export default function ColoniasPage() {
  const {
    coloniasFiltradas,
    columnas,
    opcionesCiudad,
    ciudades,
    filtro,
    setFiltro,
    filtroCiudad,
    setFiltroCiudad,
    cargando,
    guardando,
    modalAbierto,
    modoModal,
    coloniaActual,
    abrirCrear,
    abrirEditarPorId,
    onGuardar,
    eliminarSeleccionados,
    alternarActivo,
    eliminarUno,
    cargar,
    cerrarModal,
  } = useColoniasPage();

  return (
    <section className="grid gap-6">
      <Crud
        title="Colonias"
        description="Listado de colonias con acciones por seleccion."
        rows={coloniasFiltradas}
        columns={columnas}
        loading={cargando}
        getRowId={(row) => row.idColonia}
        searchLabel="Buscar colonia"
        searchPlaceholder="Nombre, CP o ciudad"
        searchValue={filtro}
        onSearchChange={setFiltro}
        filterLabel="Ciudad"
        filterValue={filtroCiudad}
        onFilterChange={setFiltroCiudad}
        filterOptions={opcionesCiudad}
        createLabel="Agregar colonia"
        onCreate={abrirCrear}
        onRefresh={cargar}
        onEdit={abrirEditarPorId}
        onDeleteOne={eliminarUno}
        onToggleActive={alternarActivo}
        onDeleteMany={eliminarSeleccionados}
      />

      <ColoniaModal
        open={modalAbierto}
        modo={modoModal}
        colonia={coloniaActual}
        ciudades={ciudades}
        loading={guardando}
        onClose={cerrarModal}
        onSubmit={onGuardar}
      />
    </section>
  );
}
