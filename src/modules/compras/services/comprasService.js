import { http } from '../../../core/api/http';

export async function listarCompras() {
  const { data } = await http.get('/compras');
  return data.data || [];
}

export async function obtenerCompraPorId(idCompra) {
  const { data } = await http.get(`/compras/${idCompra}`);
  return data.data;
}

export async function crearCompra(payload) {
  const { data } = await http.post('/compras', payload);
  return data.data;
}

export async function actualizarEstadoCompra(idCompra, estado) {
  const { data } = await http.patch(`/compras/${idCompra}/estado`, { estado });
  return data.data;
}
