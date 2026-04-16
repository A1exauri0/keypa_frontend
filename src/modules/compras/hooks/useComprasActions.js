import { useCallback } from 'react';
import { actualizarEstadoCompra, crearCompra, obtenerCompraPorId } from '../services/comprasService';

export default function useComprasActions({ toast, esAdmin, cargar, setSaving, modals }) {
  const cambiarEstado = useCallback(
    async (idCompra, estado) => {
      setSaving(true);
      try {
        await actualizarEstadoCompra(idCompra, estado);
        toast({
          title: estado === 'cancelada' ? 'Compra cancelada' : 'Estado actualizado',
          variant: estado === 'cancelada' ? 'warning' : 'success',
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

  const registrarCompra = useCallback(
    async (payload) => {
      setSaving(true);
      try {
        await crearCompra(payload);
        toast({ title: 'Compra registrada', variant: 'success' });
        modals.closeRegistro();
        await cargar();
      } catch (error) {
        toast({
          title: 'No se pudo registrar compra',
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
    async (compra) => {
      setSaving(true);
      try {
        const compraCompleta = await obtenerCompraPorId(compra.idCompra);
        modals.openDetalle(compraCompleta);
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
    (compra, estadoDestino) => {
      if (!esAdmin) {
        toast({
          title: 'Accion no permitida',
          message: 'Solo un administrador puede cancelar compras.',
          variant: 'warning',
        });
        return;
      }

      modals.openConfirmEstado(compra, estadoDestino);
    },
    [esAdmin, toast, modals],
  );

  const confirmarCambioEstado = useCallback(async () => {
    if (!modals.confirmEstadoCompra?.idCompra || !modals.confirmEstadoDestino) {
      modals.closeConfirmEstado();
      return;
    }

    await cambiarEstado(modals.confirmEstadoCompra.idCompra, modals.confirmEstadoDestino);
    modals.closeConfirmEstado();
  }, [cambiarEstado, modals]);

  return {
    registrarCompra,
    abrirDetalle,
    solicitarCambioEstado,
    confirmarCambioEstado,
  };
}
