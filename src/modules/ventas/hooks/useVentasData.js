import { useCallback, useEffect, useState } from 'react';
import { listarVentas } from '../services/ventasService';
import { listarClientes } from '../../clientes/services/clientesService';
import { listarAlmacenes } from '../../almacenes/services/almacenesService';

export default function useVentasData({ toast }) {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [ventasData, clientesData, almacenesData] = await Promise.all([
        listarVentas(),
        listarClientes(),
        listarAlmacenes(),
      ]);

      setVentas(ventasData);
      setClientes(clientesData);
      setAlmacenes(almacenesData);
    } catch (error) {
      toast({
        title: 'No se pudo cargar ventas',
        message: error.response?.data?.message,
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return {
    ventas,
    clientes,
    almacenes,
    loading,
    cargar,
  };
}
