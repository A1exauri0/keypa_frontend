import { Icon } from "@iconify/react";
import Button from "../../../core/components/ui/buttons/Button";
import InputText from "../../../core/components/ui/inputs/InputText";
import Select from "../../../core/components/ui/selectors/Select";
import InventarioModal from "../components/InventarioModal";
import useInventariosPage from "../hooks/useInventariosPage";

export default function InventariosPage() {
  const {
    inventariosFiltrados,
    inventariosPaginados,
    opcionesAlmacen,
    totalPages,
    pageSafe,
    almacenes,
    productos,
    search,
    setSearch,
    filtroAlmacen,
    setFiltroAlmacen,
    loading,
    saving,
    modalOpen,
    modalModo,
    inventarioSeleccionado,
    page,
    setPage,
    pageSize,
    setPageSize,
    abrirCrear,
    abrirAjuste,
    guardar,
    guardarAjuste,
    cargar,
    cerrarModal,
  } = useInventariosPage();

  return (
    <section className="grid gap-4">
      <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:p-5">
        <header className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 md:text-xl">
              Inventarios
            </h3>
            <p className="text-sm text-slate-600">
              Control de stock por almacén y producto.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={cargar}>
              <Icon icon="tabler:reload" width="16" />
              Recargar
            </Button>
            <Button type="button" onClick={abrirCrear}>
              <Icon icon="mdi:plus" width="16" />
              Registrar inventario
            </Button>
          </div>
        </header>

        <div className="mb-4 grid gap-3 md:grid-cols-2">
          <InputText
            id="inventarioSearch"
            label="Buscar"
            value={search}
            onChange={setSearch}
            placeholder="Producto, SKU, almacén o sucursal"
          />

          <Select
            id="inventarioAlmacenFiltro"
            label="Almacén"
            value={filtroAlmacen}
            onChange={setFiltroAlmacen}
            options={opcionesAlmacen}
          />
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Cargando inventarios...</p>
        ) : null}

        {!loading ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[980px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-2 pr-3">Producto</th>
                    <th className="py-2 pr-3">SKU</th>
                    <th className="py-2 pr-3">Sucursal</th>
                    <th className="py-2 pr-3">Almacen</th>
                    <th className="py-2 pr-3">Stock actual</th>
                    <th className="py-2 pr-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {inventariosPaginados.map((item) => (
                    <tr
                      key={item.idInventario}
                      className="border-b border-slate-100"
                    >
                      <td className="py-2 pr-3 text-slate-700">
                        {item.producto?.nombre || "-"}
                      </td>
                      <td className="py-2 pr-3 text-slate-700">
                        {item.producto?.sku || "-"}
                      </td>
                      <td className="py-2 pr-3 text-slate-700">
                        {item.almacen?.sucursal?.nombre || "-"}
                      </td>
                      <td className="py-2 pr-3 text-slate-700">
                        {item.almacen?.nombre || "-"}
                      </td>
                      <td className="py-2 pr-3 text-slate-700">
                        {item.stockActual}
                      </td>
                      <td className="py-2 pr-3">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-lg bg-fuchsia-100 px-3 py-1.5 text-xs font-semibold text-fuchsia-700 transition hover:bg-fuchsia-200"
                            title="Ajustar stock"
                            onClick={() => abrirAjuste(item.idInventario)}
                          >
                            <Icon icon="mdi:tune-variant" width="14" />
                            Ajustar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 md:hidden">
              {inventariosPaginados.map((item) => (
                <div
                  key={item.idInventario}
                  className="rounded-xl border border-slate-200 p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      ID: {item.idInventario}
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-lg bg-fuchsia-100 px-2.5 py-1 text-xs font-semibold text-fuchsia-700 transition hover:bg-fuchsia-200"
                      title="Ajustar stock"
                      onClick={() => abrirAjuste(item.idInventario)}
                    >
                      <Icon icon="mdi:tune-variant" width="14" />
                      Ajustar
                    </button>
                  </div>

                  <dl className="grid gap-1">
                    <div className="grid grid-cols-[90px_1fr] gap-2 text-sm">
                      <dt className="text-slate-500">Producto</dt>
                      <dd className="text-slate-800">
                        {item.producto?.nombre || "-"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-[90px_1fr] gap-2 text-sm">
                      <dt className="text-slate-500">SKU</dt>
                      <dd className="text-slate-800">
                        {item.producto?.sku || "-"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-[90px_1fr] gap-2 text-sm">
                      <dt className="text-slate-500">Sucursal</dt>
                      <dd className="text-slate-800">
                        {item.almacen?.sucursal?.nombre || "-"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-[90px_1fr] gap-2 text-sm">
                      <dt className="text-slate-500">Almacen</dt>
                      <dd className="text-slate-800">
                        {item.almacen?.nombre || "-"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-[90px_1fr] gap-2 text-sm">
                      <dt className="text-slate-500">Stock</dt>
                      <dd className="text-slate-800">{item.stockActual}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>

            {inventariosFiltrados.length < 1 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                No hay inventarios que coincidan con el filtro.
              </p>
            ) : null}

            {inventariosFiltrados.length > 0 ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <p className="text-xs text-slate-500">
                    {inventariosFiltrados.length} registros · Pagina {pageSafe}{" "}
                    de {totalPages}
                  </p>

                  <div className="hidden md:block md:min-w-[170px]">
                    <Select
                      id="inventariosPageSize"
                      value={String(pageSize)}
                      onChange={(value) => {
                        setPageSize(Number(value));
                        setPage(1);
                      }}
                      options={[
                        { value: "10", label: "10 por pagina" },
                        { value: "20", label: "20 por pagina" },
                        { value: "50", label: "50 por pagina" },
                      ]}
                      containerClassName="md:min-w-[170px]"
                    />
                  </div>

                  <div className="hidden md:flex md:items-center md:justify-end md:gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="justify-center"
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      disabled={pageSafe <= 1}
                    >
                      <Icon icon="mdi:chevron-left" width="16" />
                      <span>Anterior</span>
                    </Button>

                    <span className="inline-flex h-10 items-center justify-center rounded-xl bg-white px-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                      Pagina {pageSafe} de {totalPages}
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      className="justify-center"
                      onClick={() =>
                        setPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={pageSafe >= totalPages}
                    >
                      <span>Siguiente</span>
                      <Icon icon="mdi:chevron-right" width="16" />
                    </Button>
                  </div>

                  <div className="grid w-full grid-cols-3 items-center gap-2 md:hidden">
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full justify-center"
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      disabled={pageSafe <= 1}
                    >
                      <Icon icon="mdi:chevron-left" width="16" />
                      <span className="hidden sm:inline">Anterior</span>
                    </Button>

                    <span className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-white px-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                      Pag {pageSafe}/{totalPages}
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full justify-center"
                      onClick={() =>
                        setPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={pageSafe >= totalPages}
                    >
                      <span className="hidden sm:inline">Siguiente</span>
                      <Icon icon="mdi:chevron-right" width="16" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </article>

      <InventarioModal
        open={modalOpen}
        modo={modalModo}
        inventario={inventarioSeleccionado}
        almacenes={almacenes}
        productos={productos}
        loading={saving}
        onClose={cerrarModal}
        onSubmit={modalModo === "ajustar" ? guardarAjuste : guardar}
      />
    </section>
  );
}
