import { http } from '../../../core/api/http';

// Obtiene el listado de colonias con filtro opcional por ciudad.
export async function listarColonias({ idCiudad } = {}) {
  const params = idCiudad ? { idCiudad } : undefined;
  const { data } = await http.get('/colonias', { params });
  return data.data || [];
}

// Crea una colonia en el backend.
export async function crearColonia(payload) {
  const { data } = await http.post('/colonias', payload);
  return data.data;
}

// Actualiza una colonia por su ID.
export async function actualizarColonia(idColonia, payload) {
  const { data } = await http.put(`/colonias/${idColonia}`, payload);
  return data.data;
}

// Elimina en bloque las colonias seleccionadas.
export async function eliminarColoniasMultiples(ids) {
  const { data } = await http.post('/colonias/bulk-delete', { ids });
  return data;
}
