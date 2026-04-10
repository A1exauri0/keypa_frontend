import { http } from '../../../core/api/http';

export async function listarSucursales() {
  const { data } = await http.get('/sucursales');
  return data.data || [];
}

export async function crearSucursal(payload) {
  const { data } = await http.post('/sucursales', payload);
  return data.data;
}

export async function actualizarSucursal(idSucursal, payload) {
  const { data } = await http.put(`/sucursales/${idSucursal}`, payload);
  return data.data;
}

export async function eliminarSucursalesMultiples(ids) {
  const { data } = await http.post('/sucursales/bulk-delete', { ids });
  return data;
}
