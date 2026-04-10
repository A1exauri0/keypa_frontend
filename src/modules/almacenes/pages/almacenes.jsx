import { useEffect, useMemo, useState } from 'react';
import Crud from '../../../core/components/ui/complex/Crud';
import { useToast } from '../../../core/components/ui/feedback/Toast';
import AlmacenModal from '../components/AlmacenModal';
import {
  actualizarAlmacen,
  crearAlmacen,
  eliminarAlmacenesMultiples,
  listarAlmacenes,
} from '../services/almacenesService';
import { listarSucursales } from '../../sucursales/services/sucursalesService';

export default function AlmacenesPage() {
  const { toast } = useToast();
  const [almacenes, setAlmacenes] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState('crear');
  const [almacenActual, setAlmacenActual] = useState(null);

  const cargar = async () => {
    setCargando(true);
    try {
      const [almacenesData, sucursalesData] = await Promise.all([
        listarAlmacenes(),
        listarSucursales(),
      ]);

      setAlmacenes(almacenesData);
      setSucursales(sucursalesData);
    } catch (error) {
      toast({
        title: 'No se pudieron cargar almacenes',
        message: error.response?.data?.message,
        variant: 'danger',
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const almacenesFiltrados = useMemo(() => {
    const q = filtro.trim().toLowerCase();

    return almacenes.filter((item) => {
      const matchBusqueda =
        !q ||
        (item.nombre || '').toLowerCase().includes(q) ||
        (item.sucursal?.nombre || '').toLowerCase().includes(q);

      const matchActivo =
        filtroActivo === 'todos' ||
        (filtroActivo === 'activos' && item.activo) ||
        (filtroActivo === 'inactivos' && !item.activo);

      return matchBusqueda && matchActivo;
    });
  }, [almacenes, filtro, filtroActivo]);

  const columnas = [
    { key: 'nombre', label: 'Almacen' },
    { key: 'sucursal', label: 'Sucursal', render: (row) => row.sucursal?.nombre || '-' },
    {
      key: 'estado',
      label: 'Estado',
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
            row.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}
        >
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ];

  const abrirCrear = () => {
    setModoModal('crear');
    setAlmacenActual(null);
    setModalAbierto(true);
  };

  const abrirEditarPorId = (idAlmacen) => {
    const almacen = almacenes.find((item) => item.idAlmacen === idAlmacen);
    if (!almacen) {
      return;
    }

    setModoModal('editar');
    setAlmacenActual(almacen);
    setModalAbierto(true);
  };

  const onGuardar = async (payload) => {
    setGuardando(true);
    try {
      if (modoModal === 'editar' && almacenActual) {
        await actualizarAlmacen(almacenActual.idAlmacen, payload);
        toast({ title: 'Almacen actualizado', variant: 'success' });
      } else {
        await crearAlmacen(payload);
        toast({ title: 'Almacen creado', variant: 'success' });
      }

      setModalAbierto(false);
      await cargar();
    } catch (error) {
      toast({
        title: 'No se pudo guardar',
        message: error.response?.data?.message || 'Verifica los datos enviados.',
        variant: 'danger',
      });
    } finally {
      setGuardando(false);
    }
  };

  const eliminarSeleccionados = async (ids, onDone) => {
    try {
      await eliminarAlmacenesMultiples(ids);
      toast({ title: 'Almacenes eliminados', variant: 'warning' });
      onDone();
      await cargar();
    } catch (error) {
      toast({
        title: 'No se pudo eliminar',
        message: error.response?.data?.message || 'No fue posible eliminar la seleccion actual.',
        variant: 'danger',
      });
    }
  };

  const alternarActivo = async (almacen) => {
    try {
      await actualizarAlmacen(almacen.idAlmacen, { activo: !almacen.activo });
      toast({ title: almacen.activo ? 'Almacen desactivado' : 'Almacen activado', variant: 'success' });
      await cargar();
    } catch (error) {
      toast({
        title: 'No se pudo cambiar estado',
        message: error.response?.data?.message,
        variant: 'danger',
      });
    }
  };

  const eliminarUno = async (idAlmacen) => {
    try {
      await eliminarAlmacenesMultiples([idAlmacen]);
      toast({ title: 'Almacen eliminado', variant: 'warning' });
      await cargar();
    } catch (error) {
      toast({
        title: 'No se pudo eliminar',
        message: error.response?.data?.message || 'No fue posible eliminar el almacen.',
        variant: 'danger',
      });
    }
  };

  return (
    <section className="grid gap-6">
      <Crud
        title="Almacenes"
        description="Listado de almacenes vinculados a sucursales."
        rows={almacenesFiltrados}
        columns={columnas}
        loading={cargando}
        getRowId={(row) => row.idAlmacen}
        searchLabel="Buscar almacen"
        searchPlaceholder="Nombre o sucursal"
        searchValue={filtro}
        onSearchChange={setFiltro}
        filterLabel="Estado"
        filterValue={filtroActivo}
        onFilterChange={setFiltroActivo}
        filterOptions={[
          { value: 'todos', label: 'Todos' },
          { value: 'activos', label: 'Activos' },
          { value: 'inactivos', label: 'Inactivos' },
        ]}
        createLabel="Agregar almacen"
        onCreate={abrirCrear}
        onRefresh={cargar}
        onEdit={abrirEditarPorId}
        onDeleteOne={eliminarUno}
        onToggleActive={alternarActivo}
        onDeleteMany={eliminarSeleccionados}
      />

      <AlmacenModal
        open={modalAbierto}
        modo={modoModal}
        almacen={almacenActual}
        sucursales={sucursales.filter((item) => item.activo)}
        loading={guardando}
        onClose={() => setModalAbierto(false)}
        onSubmit={onGuardar}
      />
    </section>
  );
}
