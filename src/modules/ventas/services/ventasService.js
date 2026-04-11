import { http } from '../../../core/api/http';

export async function listarVentas() {
  const { data } = await http.get('/ventas');
  return data.data || [];
}

export async function obtenerCatalogoInventarioVenta(idAlmacen) {
  const params = idAlmacen ? { idAlmacen } : undefined;
  const { data } = await http.get('/ventas/catalogo-inventario', { params });
  return data.data || [];
}

export async function crearVenta(payload) {
  const { data } = await http.post('/ventas', payload);
  return data.data;
}

export async function obtenerVentaPorId(idVenta) {
  const { data } = await http.get(`/ventas/${idVenta}`);
  return data.data;
}

export async function actualizarEstadoVenta(idVenta, estado) {
  const { data } = await http.patch(`/ventas/${idVenta}/estado`, { estado });
  return data.data;
}
