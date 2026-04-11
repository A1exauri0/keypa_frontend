import { useCallback, useState } from 'react';
import {
  actualizarProducto,
  crearProducto,
  eliminarProductosMultiples,
} from '../services/productosService';

export default function useProductosActions({ toast, cargarDatos, modal }) {
  const [guardando, setGuardando] = useState(false);

  const onGuardar = useCallback(
    async (payload) => {
      setGuardando(true);
      try {
        if (modal.modoModal === 'editar' && modal.productoActual) {
          await actualizarProducto(modal.productoActual.idProducto, payload);
          toast({ title: 'Producto actualizado', variant: 'success' });
        } else {
          await crearProducto(payload);
          toast({ title: 'Producto creado', variant: 'success' });
        }

        modal.cerrarModal();
        await cargarDatos();
      } catch (error) {
        toast({
          title: 'No se pudo guardar',
          message: error.response?.data?.message || 'Revisa los campos del formulario.',
          variant: 'danger',
        });
      } finally {
        setGuardando(false);
      }
    },
    [toast, cargarDatos, modal],
  );

  const eliminarSeleccionados = useCallback(
    async (ids, onDone) => {
      try {
        await eliminarProductosMultiples(ids);
        toast({ title: 'Productos eliminados', variant: 'warning' });
        onDone();
        await cargarDatos();
      } catch (error) {
        toast({
          title: 'No se pudo eliminar',
          message: error.response?.data?.message || 'No fue posible borrar la seleccion actual.',
          variant: 'danger',
        });
      }
    },
    [toast, cargarDatos],
  );

  const alternarActivo = useCallback(
    async (producto) => {
      try {
        await actualizarProducto(producto.idProducto, { activo: !producto.activo });
        toast({ title: producto.activo ? 'Producto desactivado' : 'Producto activado', variant: 'success' });
        await cargarDatos();
      } catch (error) {
        toast({
          title: 'No se pudo cambiar estado',
          message: error.response?.data?.message || 'No fue posible actualizar el estado del producto.',
          variant: 'danger',
        });
      }
    },
    [toast, cargarDatos],
  );

  const eliminarUno = useCallback(
    async (idProducto) => {
      try {
        await eliminarProductosMultiples([idProducto]);
        toast({ title: 'Producto eliminado', variant: 'warning' });
        await cargarDatos();
      } catch (error) {
        toast({
          title: 'No se pudo eliminar',
          message: error.response?.data?.message || 'No fue posible borrar el producto.',
          variant: 'danger',
        });
      }
    },
    [toast, cargarDatos],
  );

  return {
    guardando,
    onGuardar,
    eliminarSeleccionados,
    alternarActivo,
    eliminarUno,
  };
}
