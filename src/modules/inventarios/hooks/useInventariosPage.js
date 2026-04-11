import { useCallback, useEffect, useMemo, useState } from 'react';
import { useToast } from '../../../core/components/ui/feedback/Toast';
import {
  actualizarInventario,
  crearInventario,
  listarInventarios,
} from '../services/inventariosService';
import { listarAlmacenes } from '../../almacenes/services/almacenesService';
import { listarProductos } from '../../productos/services/productosService';

export default function useInventariosPage() {
  const { toast } = useToast();
  const [inventarios, setInventarios] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState('');
  const [filtroAlmacen, setFiltroAlmacen] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalModo, setModalModo] = useState('crear');
  const [inventarioSeleccionado, setInventarioSeleccionado] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [inventariosData, almacenesData, productosData] = await Promise.all([
        listarInventarios(),
        listarAlmacenes(),
        listarProductos(),
      ]);

      setInventarios(inventariosData);
      setAlmacenes(almacenesData);
      setProductos(productosData);
    } catch (error) {
      toast({
        title: 'No se pudo cargar inventarios',
        message: error.response?.data?.message,
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const inventariosFiltrados = useMemo(() => {
    const q = search.trim().toLowerCase();

    return inventarios.filter((item) => {
      const matchBusqueda =
        !q ||
        (item.producto?.nombre || '').toLowerCase().includes(q) ||
        (item.producto?.sku || '').toLowerCase().includes(q) ||
        (item.almacen?.nombre || '').toLowerCase().includes(q) ||
        (item.almacen?.sucursal?.nombre || '').toLowerCase().includes(q);

      const matchAlmacen =
        filtroAlmacen === 'todos' ||
        String(item.idAlmacen) === String(filtroAlmacen);

      return matchBusqueda && matchAlmacen;
    });
  }, [inventarios, search, filtroAlmacen]);

  useEffect(() => {
    setPage(1);
  }, [search, filtroAlmacen]);

  const opcionesAlmacen = useMemo(
    () => [
      { value: 'todos', label: 'Todos los almacenes' },
      ...almacenes.map((item) => ({
        value: String(item.idAlmacen),
        label: item.nombre,
      })),
    ],
    [almacenes],
  );

  const totalPages = Math.max(1, Math.ceil(inventariosFiltrados.length / pageSize));
  const pageSafe = Math.min(page, totalPages);

  const inventariosPaginados = useMemo(() => {
    const start = (pageSafe - 1) * pageSize;
    return inventariosFiltrados.slice(start, start + pageSize);
  }, [inventariosFiltrados, pageSafe, pageSize]);

  const abrirCrear = () => {
    setModalModo('crear');
    setInventarioSeleccionado(null);
    setModalOpen(true);
  };

  const abrirAjuste = (idInventario) => {
    const inventario = inventarios.find((item) => item.idInventario === idInventario);
    if (!inventario) {
      return;
    }

    setModalModo('ajustar');
    setInventarioSeleccionado(inventario);
    setModalOpen(true);
  };

  const guardar = async (payload) => {
    setSaving(true);
    try {
      await crearInventario(payload);
      toast({ title: 'Inventario agregado', variant: 'success' });
      setModalOpen(false);
      await cargar();
    } catch (error) {
      toast({
        title: 'No se pudo guardar',
        message: error.response?.data?.message || 'Verifica los datos del inventario.',
        variant: 'danger',
      });
    } finally {
      setSaving(false);
    }
  };

  const guardarAjuste = async (payload) => {
    if (!inventarioSeleccionado) {
      return;
    }

    setSaving(true);
    try {
      await actualizarInventario(inventarioSeleccionado.idInventario, payload);
      toast({ title: 'Stock ajustado', variant: 'success' });
      setModalOpen(false);
      setInventarioSeleccionado(null);
      await cargar();
    } catch (error) {
      toast({
        title: 'No se pudo ajustar stock',
        message: error.response?.data?.message || 'Verifica los valores de stock.',
        variant: 'danger',
      });
    } finally {
      setSaving(false);
    }
  };

  return {
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
    cerrarModal: () => {
      setModalOpen(false);
      setInventarioSeleccionado(null);
    },
  };
}
