import Crud from '../../../core/components/ui/complex/Crud';
import CategoriaModal from '../components/CategoriaModal';
import useCategoriasPage from '../hooks/useCategoriasPage';

export default function CategoriasPage() {
  const {
    categoriasFiltradas,
    columnas,
    filtro,
    setFiltro,
    filtroActivo,
    setFiltroActivo,
    cargando,
    guardando,
    modalAbierto,
    modoModal,
    categoriaActual,
    abrirCrear,
    abrirEditarPorId,
    onGuardar,
    eliminarSeleccionados,
    alternarActivo,
    eliminarUno,
    cargar,
    cerrarModal,
  } = useCategoriasPage();

  return (
    <section className="grid gap-6">
      <Crud
        title="Categorias"
        description="Listado de categorias con acciones por seleccion."
        rows={categoriasFiltradas}
        columns={columnas}
        loading={cargando}
        getRowId={(row) => row.idCategoria}
        searchLabel="Buscar categoria"
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
        createLabel="Agregar categoria"
        onCreate={abrirCrear}
        onRefresh={cargar}
        onEdit={abrirEditarPorId}
        onDeleteOne={eliminarUno}
        onToggleActive={alternarActivo}
        onDeleteMany={eliminarSeleccionados}
      />

      <CategoriaModal
        open={modalAbierto}
        modo={modoModal}
        categoria={categoriaActual}
        loading={guardando}
        onClose={cerrarModal}
        onSubmit={onGuardar}
      />
    </section>
  );
}
