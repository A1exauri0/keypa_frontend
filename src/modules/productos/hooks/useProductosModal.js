import { useState } from 'react';

export default function useProductosModal() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState('crear');
  const [productoActual, setProductoActual] = useState(null);

  const abrirCrear = () => {
    setModoModal('crear');
    setProductoActual(null);
    setModalAbierto(true);
  };

  const abrirActualizar = (producto) => {
    if (!producto) {
      return;
    }

    setModoModal('editar');
    setProductoActual(producto);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  return {
    modalAbierto,
    modoModal,
    productoActual,
    abrirCrear,
    abrirActualizar,
    cerrarModal,
  };
}
