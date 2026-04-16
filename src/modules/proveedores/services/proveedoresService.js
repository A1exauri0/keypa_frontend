import { http } from '../../../core/api/http';

// Obtiene el listado de proveedores desde el endpoint de proveedores.
export async function listarProveedores() {
  const { data } = await http.get('/proveedores');
  return data.data || [];
}

// Crea un proveedor en el backend.
export async function crearProveedor(payload) {
  const { data } = await http.post('/proveedores', payload);
  return data.data;
}

// Actualiza un proveedor por su ID.
export async function actualizarProveedor(idProveedor, payload) {
  const { data } = await http.put(`/proveedores/${idProveedor}`, payload);
  return data.data;
}

// Elimina en bloque los proveedores seleccionados.
export async function eliminarProveedoresMultiples(ids) {
  const { data } = await http.post('/proveedores/bulk-delete', { ids });
  return data;
}
