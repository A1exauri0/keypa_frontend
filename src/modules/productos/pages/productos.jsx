import Crud from '../../../core/components/ui/complex/Crud';
import { useToast } from '../../../core/components/ui/feedback/Toast';
import ProductoModal from '../components/ProductoModal';
import { subirImagenProducto } from '../services/productosService';
import useProductosData from '../hooks/useProductosData';
import useProductosFiltros from '../hooks/useProductosFiltros';
import useProductosModal from '../hooks/useProductosModal';
import useProductosActions from '../hooks/useProductosActions';

export default function ProductosPage() {
  const { toast } = useToast();
  const { productos, marcas, categorias, cargando, cargarDatos } = useProductosData({ toast });
  const { filtro, setFiltro, filtroTipo, setFiltroTipo, productosFiltrados } = useProductosFiltros(productos);
  const modal = useProductosModal();
  const { guardando, onGuardar, eliminarSeleccionados, alternarActivo, eliminarUno } = useProductosActions({
    toast,
    cargarDatos,
    modal,
  });

  const columnas = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'sku', label: 'SKU' },
    {
      key: 'marca',
      label: 'Marca',
      render: (row) => row.marca?.nombre || '-',
    },
    { key: 'tipo', label: 'Tipo' },
    {
      key: 'precio',
      label: 'Precio',
      render: (row) => `$${Number(row.precio).toFixed(2)}`,
    },
    {
      key: 'categorias',
      label: 'Categorias',
      render: (row) =>
        (row.categorias || []).map((item) => item.categoria?.nombre).filter(Boolean).join(', ') || '-',
    },
  ];

  const abrirActualizar = (idProducto) => {
    const producto = productos.find((item) => item.idProducto === idProducto);
    modal.abrirActualizar(producto);
  };

  return (
    <section className="grid gap-6">
      <Crud
        title="Productos"
        description="Listado de productos con acciones por seleccion."
        rows={productosFiltrados}
        columns={columnas}
        loading={cargando}
        getRowId={(row) => row.idProducto}
        searchLabel="Buscar producto"
        searchPlaceholder="Nombre, SKU o marca"
        searchValue={filtro}
        onSearchChange={setFiltro}
        filterLabel="Tipo"
        filterValue={filtroTipo}
        onFilterChange={setFiltroTipo}
        filterOptions={[
          { value: 'todos', label: 'Todos' },
          { value: 'Ropa', label: 'Ropa' },
          { value: 'Maquillaje', label: 'Maquillaje' },
          { value: 'Accesorios', label: 'Accesorios' },
          { value: 'Otros', label: 'Otros' },
        ]}
        createLabel="Agregar producto"
        onCreate={modal.abrirCrear}
        onRefresh={cargarDatos}
        onEdit={abrirActualizar}
        onDeleteOne={eliminarUno}
        onToggleActive={alternarActivo}
        onDeleteMany={eliminarSeleccionados}
      />

      <ProductoModal
        open={modal.modalAbierto}
        modo={modal.modoModal}
        producto={modal.productoActual}
        marcas={marcas}
        categorias={categorias}
        onUploadImage={subirImagenProducto}
        loading={guardando}
        onClose={modal.cerrarModal}
        onSubmit={onGuardar}
      />
    </section>
  );
}
