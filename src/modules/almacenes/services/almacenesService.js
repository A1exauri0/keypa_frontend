import { http } from '../../../core/api/http';

export async function listarAlmacenes() {
  const { data } = await http.get('/almacenes');
  return data.data || [];
}

export async function crearAlmacen(payload) {
  const { data } = await http.post('/almacenes', payload);
  return data.data;
}

export async function actualizarAlmacen(idAlmacen, payload) {
  const { data } = await http.put(`/almacenes/${idAlmacen}`, payload);
  return data.data;
}

export async function eliminarAlmacenesMultiples(ids) {
  const { data } = await http.post('/almacenes/bulk-delete', { ids });
  return data;
}
