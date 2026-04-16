import { useCallback, useEffect, useState } from 'react';
import { listarCompras } from '../services/comprasService';
import { listarProveedores } from '../../proveedores/services/proveedoresService';
import { listarAlmacenes } from '../../almacenes/services/almacenesService';
import { listarProductos } from '../../productos/services/productosService';

export default function useComprasData({ toast }) {
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [comprasData, proveedoresData, almacenesData, productosData] = await Promise.all([
        listarCompras(),
        listarProveedores(),
        listarAlmacenes(),
        listarProductos(),
      ]);

      setCompras(comprasData);
      setProveedores(proveedoresData);
      setAlmacenes(almacenesData);
      setProductos(productosData);
    } catch (error) {
      toast({
        title: 'No se pudo cargar compras',
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

  return {
    compras,
    proveedores,
    almacenes,
    productos,
    loading,
    cargar,
  };
}
