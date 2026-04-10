import { http } from '../../../core/api/http';

// Obtiene el listado de productos con filtros opcionales.
export async function listarProductos(params = {}) {
  const { data } = await http.get('/productos', { params });
  return data.data || [];
}

// Crea un producto en catalogo.
export async function crearProducto(payload) {
  const { data } = await http.post('/productos', payload);
  return data.data;
}

// Actualiza un producto por su ID.
export async function actualizarProducto(idProducto, payload) {
  const { data } = await http.put(`/productos/${idProducto}`, payload);
  return data.data;
}

// Elimina en bloque los productos seleccionados.
export async function eliminarProductosMultiples(ids) {
  const { data } = await http.post('/productos/bulk-delete', { ids });
  return data;
}

// Sube una imagen de producto y devuelve la URL publica.
export async function subirImagenProducto(file) {
  const formData = new FormData();
  formData.append('image', file);

  const { data } = await http.post('/productos/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data.data;
}
