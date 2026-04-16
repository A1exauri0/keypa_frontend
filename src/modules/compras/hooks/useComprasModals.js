import { useState } from 'react';

export default function useComprasModals() {
  const [modalOpen, setModalOpen] = useState(false);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [compraDetalle, setCompraDetalle] = useState(null);
  const [confirmEstadoOpen, setConfirmEstadoOpen] = useState(false);
  const [confirmEstadoCompra, setConfirmEstadoCompra] = useState(null);
  const [confirmEstadoDestino, setConfirmEstadoDestino] = useState('');

  const openRegistro = () => setModalOpen(true);
  const closeRegistro = () => setModalOpen(false);

  const openDetalle = (compra) => {
    setCompraDetalle(compra);
    setDetalleOpen(true);
  };

  const closeDetalle = () => {
    setDetalleOpen(false);
    setCompraDetalle(null);
  };

  const openConfirmEstado = (compra, estadoDestino) => {
    setConfirmEstadoCompra(compra);
    setConfirmEstadoDestino(estadoDestino);
    setConfirmEstadoOpen(true);
  };

  const closeConfirmEstado = () => {
    setConfirmEstadoOpen(false);
    setConfirmEstadoCompra(null);
    setConfirmEstadoDestino('');
  };

  return {
    modalOpen,
    detalleOpen,
    compraDetalle,
    confirmEstadoOpen,
    confirmEstadoCompra,
    confirmEstadoDestino,
    openRegistro,
    closeRegistro,
    openDetalle,
    closeDetalle,
    openConfirmEstado,
    closeConfirmEstado,
  };
}
