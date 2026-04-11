import { useMemo, useState } from 'react';

export default function useVentasFiltros(ventas = []) {
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const ventasFiltradas = useMemo(() => {
    const q = search.trim().toLowerCase();

    return ventas.filter((item) => {
      const clienteNombre = `${item.cliente?.nombre || ''} ${item.cliente?.apellidos || ''}`.toLowerCase();
      const coincideBusqueda =
        !q ||
        (item.folio || '').toLowerCase().includes(q) ||
        clienteNombre.includes(q) ||
        (item.almacen?.nombre || '').toLowerCase().includes(q);

      const coincideEstado = filtroEstado === 'todos' || item.estado === filtroEstado;

      return coincideBusqueda && coincideEstado;
    });
  }, [ventas, search, filtroEstado]);

  return {
    search,
    setSearch,
    filtroEstado,
    setFiltroEstado,
    ventasFiltradas,
  };
}
