import { useMemo, useState } from 'react';

export default function useComprasFiltros(compras = []) {
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const comprasFiltradas = useMemo(() => {
    const q = search.trim().toLowerCase();

    return compras.filter((item) => {
      const proveedor = item.proveedor?.nombre || '';
      const almacen = item.almacen?.nombre || '';

      const coincideBusqueda =
        !q ||
        (item.folio || '').toLowerCase().includes(q) ||
        proveedor.toLowerCase().includes(q) ||
        almacen.toLowerCase().includes(q);

      const coincideEstado = filtroEstado === 'todos' || item.estado === filtroEstado;

      return coincideBusqueda && coincideEstado;
    });
  }, [compras, search, filtroEstado]);

  return {
    search,
    setSearch,
    filtroEstado,
    setFiltroEstado,
    comprasFiltradas,
  };
}
