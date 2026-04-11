import { useCallback } from 'react';
import { actualizarEstadoVenta, crearVenta, obtenerVentaPorId } from '../services/ventasService';

export default function useVentasActions({ toast, esAdmin, cargar, setSaving, modals }) {
  const cambiarEstado = useCallback(
    async (idVenta, estado) => {
      setSaving(true);
      try {
        await actualizarEstadoVenta(idVenta, estado);
        toast({
          title: estado === 'pagado' ? 'Venta marcada como pagada' : 'Venta cancelada',
          variant: estado === 'pagado' ? 'success' : 'warning',
        });
        await cargar();
      } catch (error) {
        toast({
          title: 'No se pudo actualizar estado',
          message: error.response?.data?.message,
          variant: 'danger',
        });
      } finally {
        setSaving(false);
      }
    },
    [toast, cargar, setSaving],
  );

  const registrarVenta = useCallback(
    async (payload) => {
      setSaving(true);
      try {
        const venta = await crearVenta(payload);
        let ventaFinal = venta;

        if (venta?.estado === 'pendiente') {
          ventaFinal = await actualizarEstadoVenta(venta.idVenta, 'pagado');
        }

        modals.openExitosa(ventaFinal);
        toast({ title: 'Venta registrada', variant: 'success' });
        modals.closeRegistro();
        await cargar();
      } catch (error) {
        toast({
          title: 'No se pudo registrar venta',
          message: error.response?.data?.message || 'Verifica los datos enviados.',
          variant: 'danger',
        });
      } finally {
        setSaving(false);
      }
    },
    [toast, cargar, modals, setSaving],
  );

  const abrirDetalle = useCallback(
    async (venta) => {
      setSaving(true);
      try {
        const ventaCompleta = await obtenerVentaPorId(venta.idVenta);
        modals.openDetalle(ventaCompleta);
      } catch (error) {
        toast({
          title: 'No se pudo cargar el detalle',
          message: error.response?.data?.message,
          variant: 'danger',
        });
      } finally {
        setSaving(false);
      }
    },
    [toast, modals, setSaving],
  );

  const solicitarCambioEstado = useCallback(
    (venta, estadoDestino) => {
      if (!esAdmin) {
        toast({
          title: 'Accion no permitida',
          message: 'Solo un administrador puede pagar o cancelar ventas.',
          variant: 'warning',
        });
        return;
      }

      modals.openConfirmEstado(venta, estadoDestino);
    },
    [esAdmin, toast, modals],
  );

  const confirmarCambioEstado = useCallback(async () => {
    if (!modals.confirmEstadoVenta?.idVenta || !modals.confirmEstadoDestino) {
      modals.closeConfirmEstado();
      return;
    }

    await cambiarEstado(modals.confirmEstadoVenta.idVenta, modals.confirmEstadoDestino);
    modals.closeConfirmEstado();
  }, [cambiarEstado, modals]);

  return {
    registrarVenta,
    abrirDetalle,
    solicitarCambioEstado,
    confirmarCambioEstado,
  };
}
