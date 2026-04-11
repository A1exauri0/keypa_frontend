import { useCallback, useEffect, useState } from 'react';
import { listarCategorias } from '../services/categoriasService';
import { listarMarcas } from '../services/marcasService';
import { listarProductos } from '../services/productosService';

export default function useProductosData({ toast }) {
  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarDatos = useCallback(async () => {
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
  }, [toast]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  return {
    productos,
    marcas,
    categorias,
    cargando,
    cargarDatos,
  };
}
