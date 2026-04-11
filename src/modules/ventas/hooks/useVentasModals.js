import { useState } from 'react';

export default function useVentasModals() {
  const [modalOpen, setModalOpen] = useState(false);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [ventaDetalle, setVentaDetalle] = useState(null);
  const [ventaExitosaOpen, setVentaExitosaOpen] = useState(false);
  const [ventaExitosa, setVentaExitosa] = useState(null);
  const [confirmEstadoOpen, setConfirmEstadoOpen] = useState(false);
  const [confirmEstadoVenta, setConfirmEstadoVenta] = useState(null);
  const [confirmEstadoDestino, setConfirmEstadoDestino] = useState('');

  const openRegistro = () => setModalOpen(true);
  const closeRegistro = () => setModalOpen(false);

  const openDetalle = (venta) => {
    setVentaDetalle(venta);
    setDetalleOpen(true);
  };

  const closeDetalle = () => {
    setDetalleOpen(false);
    setVentaDetalle(null);
  };

  const openExitosa = (venta) => {
    setVentaExitosa(venta);
    setVentaExitosaOpen(true);
  };

  const closeExitosa = () => {
    setVentaExitosaOpen(false);
    setVentaExitosa(null);
  };

  const openConfirmEstado = (venta, estadoDestino) => {
    setConfirmEstadoVenta(venta);
    setConfirmEstadoDestino(estadoDestino);
    setConfirmEstadoOpen(true);
  };

  const closeConfirmEstado = () => {
    setConfirmEstadoOpen(false);
    setConfirmEstadoVenta(null);
    setConfirmEstadoDestino('');
  };

  return {
    modalOpen,
    detalleOpen,
    ventaDetalle,
    ventaExitosaOpen,
    ventaExitosa,
    confirmEstadoOpen,
    confirmEstadoVenta,
    confirmEstadoDestino,
    openRegistro,
    closeRegistro,
    openDetalle,
    closeDetalle,
    openExitosa,
    closeExitosa,
    openConfirmEstado,
    closeConfirmEstado,
  };
}
