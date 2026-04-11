import Crud from "../../../core/components/ui/complex/Crud";
import ClienteModal from "../components/ClienteModal";
import useClientesPage from "../hooks/useClientesPage";

export default function ClientesPage() {
  const {
    clientesFiltrados,
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
    clienteActual,
    abrirCrear,
    abrirEditarPorId,
    onGuardar,
    eliminarSeleccionados,
    alternarActivo,
    eliminarUno,
    cargar,
    cerrarModal,
  } = useClientesPage();

  return (
    <section className="grid gap-6">
      <Crud
        title="Clientes"
        description="Listado de clientes con acciones por seleccion."
        rows={clientesFiltrados}
        columns={columnas}
        loading={cargando}
        getRowId={(row) => row.idCliente}
        searchLabel="Buscar cliente"
        searchPlaceholder="Nombre, email, telefono o ciudad"
        searchValue={filtro}
        onSearchChange={setFiltro}
        filterLabel="Estado"
        filterValue={filtroActivo}
        onFilterChange={setFiltroActivo}
        filterOptions={[
          { value: "todos", label: "Todos" },
          { value: "activos", label: "Activos" },
          { value: "inactivos", label: "Inactivos" },
        ]}
        createLabel="Agregar cliente"
        onCreate={abrirCrear}
        onRefresh={cargar}
        onEdit={abrirEditarPorId}
        onDeleteOne={eliminarUno}
        onToggleActive={alternarActivo}
        onDeleteMany={eliminarSeleccionados}
      />

      <ClienteModal
        open={modalAbierto}
        modo={modoModal}
        cliente={clienteActual}
        ciudades={ciudades}
        colonias={colonias}
        loading={guardando}
        onClose={cerrarModal}
        onSubmit={onGuardar}
      />
    </section>
  );
}
