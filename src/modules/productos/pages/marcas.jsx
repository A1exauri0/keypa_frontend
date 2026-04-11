import Crud from '../../../core/components/ui/complex/Crud';
import MarcaModal from '../components/MarcaModal';
import useMarcasPage from '../hooks/useMarcasPage';

export default function MarcasPage() {
  const {
    marcasFiltradas,
    columnas,
    filtro,
    setFiltro,
    filtroActivo,
    setFiltroActivo,
    cargando,
    guardando,
    modalAbierto,
    modoModal,
    marcaActual,
    abrirCrear,
    abrirEditarPorId,
    onGuardar,
    eliminarSeleccionados,
    alternarActivo,
    eliminarUno,
    cargar,
    cerrarModal,
  } = useMarcasPage();

  return (
    <section className="grid gap-6">
      <Crud
        title="Marcas"
        description="Listado de marcas con acciones por seleccion."
        rows={marcasFiltradas}
        columns={columnas}
        loading={cargando}
        getRowId={(row) => row.idMarca}
        searchLabel="Buscar marca"
        searchPlaceholder="Nombre o slug"
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
        createLabel="Agregar marca"
        onCreate={abrirCrear}
        onRefresh={cargar}
        onEdit={abrirEditarPorId}
        onDeleteOne={eliminarUno}
        onToggleActive={alternarActivo}
        onDeleteMany={eliminarSeleccionados}
      />

      <MarcaModal
        open={modalAbierto}
        modo={modoModal}
        marca={marcaActual}
        loading={guardando}
        onClose={cerrarModal}
        onSubmit={onGuardar}
      />
    </section>
  );
}
