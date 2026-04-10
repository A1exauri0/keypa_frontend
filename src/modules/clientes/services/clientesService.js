import { http } from '../../../core/api/http';

// Obtiene el listado de clientes desde el endpoint de clientes.
export async function listarClientes() {
  const { data } = await http.get('/clientes');
  return data.data || [];
}

// Crea un cliente en el backend.
export async function crearCliente(payload) {
  const { data } = await http.post('/clientes', payload);
  return data.data;
}

// Actualiza un cliente por su ID.
export async function actualizarCliente(idCliente, payload) {
  const { data } = await http.put(`/clientes/${idCliente}`, payload);
  return data.data;
}

// Elimina en bloque los clientes seleccionados.
export async function eliminarClientesMultiples(ids) {
  const { data } = await http.post('/clientes/bulk-delete', { ids });
  return data;
}
