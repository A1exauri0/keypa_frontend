import { http } from '../../../core/api/http';

// Obtiene el listado de categorias desde el endpoint de catalogo.
export async function listarCategorias() {
  const { data } = await http.get('/categorias');
  return data.data || [];
}

// Crea una categoria en el backend.
export async function crearCategoria(payload) {
  const { data } = await http.post('/categorias', payload);
  return data.data;
}

// Actualiza una categoria por su ID.
export async function actualizarCategoria(idCategoria, payload) {
  const { data } = await http.put(`/categorias/${idCategoria}`, payload);
  return data.data;
}

// Elimina en bloque las categorias seleccionadas.
export async function eliminarCategoriasMultiples(ids) {
  const { data } = await http.post('/categorias/bulk-delete', { ids });
  return data;
}
