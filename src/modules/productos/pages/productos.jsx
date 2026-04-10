import { useEffect, useMemo, useState } from 'react';
import Crud from '../../../core/components/ui/Crud';
import { useToast } from '../../../core/components/ui/Toast';
import ProductoModal from '../components/ProductoModal';
import { listarCategorias } from '../services/categoriasService';
import { listarMarcas } from '../services/marcasService';
import {
  actualizarProducto,
  crearProducto,
  eliminarProductosMultiples,
  listarProductos,
  subirImagenProducto,
} from '../services/productosService';

export default function ProductosPage() {
  const { toast } = useToast();
  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState('crear');
  const [productoActual, setProductoActual] = useState(null);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [productosData, marcasData, categoriasData] = await Promise.all([
        listarProductos(),
        listarMarcas(),
        listarCategorias(),
      ]);
      setProductos(productosData);
      setMarcas(marcasData);
      setCategorias(categoriasData);
    } catch (error) {
      toast({
        title: 'Error al cargar productos',
        message: error.response?.data?.message || 'No se pudo cargar el catalogo.',
        variant: 'danger',
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const productosFiltrados = useMemo(() => {
    const q = filtro.trim().toLowerCase();

    return productos.filter((item) => {
      const marca = item.marca?.nombre || '';
      const matchBusqueda =
        !q ||
        item.nombre.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        marca.toLowerCase().includes(q);

      const matchTipo = filtroTipo === 'todos' || item.tipo === filtroTipo;
      return matchBusqueda && matchTipo;
    });
  }, [productos, filtro, filtroTipo]);

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

  const abrirCrear = () => {
    setModoModal('crear');
    setProductoActual(null);
    setModalAbierto(true);
  };

  const abrirActualizar = (idProducto) => {
    const producto = productos.find((item) => item.idProducto === idProducto);
    if (!producto) {
      return;
    }

    setModoModal('editar');
    setProductoActual(producto);
    setModalAbierto(true);
  };

  const onGuardar = async (payload) => {
    setGuardando(true);
    try {
      if (modoModal === 'editar' && productoActual) {
        await actualizarProducto(productoActual.idProducto, payload);
        toast({ title: 'Producto actualizado', variant: 'success' });
      } else {
        await crearProducto(payload);
        toast({ title: 'Producto creado', variant: 'success' });
      }

      setModalAbierto(false);
      await cargarDatos();
    } catch (error) {
      toast({
        title: 'No se pudo guardar',
        message: error.response?.data?.message || 'Revisa los campos del formulario.',
        variant: 'danger',
      });
    } finally {
      setGuardando(false);
    }
  };

  const eliminarSeleccionados = async (ids, onDone) => {
    try {
      await eliminarProductosMultiples(ids);
      toast({ title: 'Productos eliminados', variant: 'warning' });
      onDone();
      await cargarDatos();
    } catch (error) {
      toast({
        title: 'No se pudo eliminar',
        message: error.response?.data?.message || 'No fue posible borrar la seleccion actual.',
        variant: 'danger',
      });
    }
  };

  const alternarActivo = async (producto) => {
    try {
      await actualizarProducto(producto.idProducto, { activo: !producto.activo });
      toast({ title: producto.activo ? 'Producto desactivado' : 'Producto activado', variant: 'success' });
      await cargarDatos();
    } catch (error) {
      toast({
        title: 'No se pudo cambiar estado',
        message: error.response?.data?.message || 'No fue posible actualizar el estado del producto.',
        variant: 'danger',
      });
    }
  };

  const eliminarUno = async (idProducto) => {
    try {
      await eliminarProductosMultiples([idProducto]);
      toast({ title: 'Producto eliminado', variant: 'warning' });
      await cargarDatos();
    } catch (error) {
      toast({
        title: 'No se pudo eliminar',
        message: error.response?.data?.message || 'No fue posible borrar el producto.',
        variant: 'danger',
      });
    }
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
        onCreate={abrirCrear}
        onRefresh={cargarDatos}
        onEdit={abrirActualizar}
        onDeleteOne={eliminarUno}
        onToggleActive={alternarActivo}
        onDeleteMany={eliminarSeleccionados}
      />

      <ProductoModal
        open={modalAbierto}
        modo={modoModal}
        producto={productoActual}
        marcas={marcas}
        categorias={categorias}
        onUploadImage={subirImagenProducto}
        loading={guardando}
        onClose={() => setModalAbierto(false)}
        onSubmit={onGuardar}
      />
    </section>
  );
}
