import { http } from '../../../core/api/http';

// Obtiene el listado de ciudades desde el endpoint de ubicaciones.
export async function listarCiudades() {
  const { data } = await http.get('/ciudades');
  return data.data || [];
}

// Crea una ciudad en el backend.
export async function crearCiudad(payload) {
  const { data } = await http.post('/ciudades', payload);
  return data.data;
}

// Actualiza una ciudad por su ID.
export async function actualizarCiudad(idCiudad, payload) {
  const { data } = await http.put(`/ciudades/${idCiudad}`, payload);
  return data.data;
}

// Elimina en bloque las ciudades seleccionadas.
export async function eliminarCiudadesMultiples(ids) {
  const { data } = await http.post('/ciudades/bulk-delete', { ids });
  return data;
}
