import { http } from '../../../core/api/http';

export async function listarInventarios() {
  const { data } = await http.get('/inventarios');
  return data.data || [];
}

export async function crearInventario(payload) {
  const { data } = await http.post('/inventarios', payload);
  return data.data;
}

export async function actualizarInventario(idInventario, payload) {
  const { data } = await http.put(`/inventarios/${idInventario}`, payload);
  return data.data;
}

export async function eliminarInventario(idInventario) {
  const { data } = await http.delete(`/inventarios/${idInventario}`);
  return data;
}

export async function eliminarInventariosMultiples(ids) {
  const { data } = await http.post('/inventarios/bulk-delete', { ids });
  return data;
}
