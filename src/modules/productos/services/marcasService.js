import { http } from '../../../core/api/http';

// Obtiene el listado de marcas desde el endpoint de catalogo.
export async function listarMarcas() {
  const { data } = await http.get('/marcas');
  return data.data || [];
}

// Crea una marca en el backend.
export async function crearMarca(payload) {
  const { data } = await http.post('/marcas', payload);
  return data.data;
}

// Actualiza una marca por su ID.
export async function actualizarMarca(idMarca, payload) {
  const { data } = await http.put(`/marcas/${idMarca}`, payload);
  return data.data;
}

// Elimina en bloque las marcas seleccionadas.
export async function eliminarMarcasMultiples(ids) {
  const { data } = await http.post('/marcas/bulk-delete', { ids });
  return data;
}
