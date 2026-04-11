import { useMemo, useState } from 'react';

export default function useProductosFiltros(productos = []) {
  const [filtro, setFiltro] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');

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

  return {
    filtro,
    setFiltro,
    filtroTipo,
    setFiltroTipo,
    productosFiltrados,
  };
}
