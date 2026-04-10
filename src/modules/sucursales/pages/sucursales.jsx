import { useEffect, useMemo, useState } from 'react';
import Crud from '../../../core/components/ui/complex/Crud';
import { useToast } from '../../../core/components/ui/feedback/Toast';
import SucursalModal from '../components/SucursalModal';
import {
  actualizarSucursal,
  crearSucursal,
  eliminarSucursalesMultiples,
  listarSucursales,
} from '../services/sucursalesService';
import { listarCiudades } from '../../ubicaciones/services/ciudadesService';
import { listarColonias } from '../../ubicaciones/services/coloniasService';

export default function SucursalesPage() {
  const { toast } = useToast();
  const [sucursales, setSucursales] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [colonias, setColonias] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState('crear');
  const [sucursalActual, setSucursalActual] = useState(null);

  const cargar = async () => {
    setCargando(true);
    try {
      const [sucursalesData, ciudadesData, coloniasData] = await Promise.all([
        listarSucursales(),
        listarCiudades(),
        listarColonias(),
      ]);

      setSucursales(sucursalesData);
      setCiudades(ciudadesData);
      setColonias(coloniasData);
    } catch (error) {
      toast({
        title: 'No se pudieron cargar sucursales',
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

  const sucursalesFiltradas = useMemo(() => {
    const q = filtro.trim().toLowerCase();

    return sucursales.filter((item) => {
      const matchBusqueda =
        !q ||
        (item.nombre || '').toLowerCase().includes(q) ||
        (item.telefono || '').toLowerCase().includes(q) ||
        (item.email || '').toLowerCase().includes(q) ||
        (item.ciudad?.nombre || '').toLowerCase().includes(q);

      const matchActivo =
        filtroActivo === 'todos' ||
        (filtroActivo === 'activos' && item.activo) ||
        (filtroActivo === 'inactivos' && !item.activo);

      return matchBusqueda && matchActivo;
    });
  }, [sucursales, filtro, filtroActivo]);

  const columnas = [
    { key: 'nombre', label: 'Sucursal' },
    { key: 'telefono', label: 'Telefono' },
    { key: 'email', label: 'Email', render: (row) => row.email || '-' },
    { key: 'encargado', label: 'Encargado', render: (row) => row.encargado || '-' },
    {
      key: 'ubicacion',
      label: 'Ubicacion',
      render: (row) => `${row.ciudad?.nombre || '-'} / ${row.colonia?.nombre || '-'}`,
    },
    {
      key: 'almacenes',
      label: 'Almacenes',
      render: (row) => row._count?.almacenes ?? 0,
    },
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
    setSucursalActual(null);
    setModalAbierto(true);
  };

  const abrirEditarPorId = (idSucursal) => {
    const sucursal = sucursales.find((item) => item.idSucursal === idSucursal);
    if (!sucursal) {
      return;
    }

    setModoModal('editar');
    setSucursalActual(sucursal);
    setModalAbierto(true);
  };

  const onGuardar = async (payload) => {
    setGuardando(true);
    try {
      if (modoModal === 'editar' && sucursalActual) {
        await actualizarSucursal(sucursalActual.idSucursal, payload);
        toast({ title: 'Sucursal actualizada', variant: 'success' });
      } else {
        await crearSucursal(payload);
        toast({ title: 'Sucursal creada', variant: 'success' });
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
      await eliminarSucursalesMultiples(ids);
      toast({ title: 'Sucursales eliminadas', variant: 'warning' });
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

  const alternarActivo = async (sucursal) => {
    try {
      await actualizarSucursal(sucursal.idSucursal, { activo: !sucursal.activo });
      toast({ title: sucursal.activo ? 'Sucursal desactivada' : 'Sucursal activada', variant: 'success' });
      await cargar();
    } catch (error) {
      toast({
        title: 'No se pudo cambiar estado',
        message: error.response?.data?.message,
        variant: 'danger',
      });
    }
  };

  const eliminarUno = async (idSucursal) => {
    try {
      await eliminarSucursalesMultiples([idSucursal]);
      toast({ title: 'Sucursal eliminada', variant: 'warning' });
      await cargar();
    } catch (error) {
      toast({
        title: 'No se pudo eliminar',
        message: error.response?.data?.message || 'No fue posible eliminar la sucursal.',
        variant: 'danger',
      });
    }
  };

  return (
    <section className="grid gap-6">
      <Crud
        title="Sucursales"
        description="Listado de sucursales con administracion de estado y ubicacion."
        rows={sucursalesFiltradas}
        columns={columnas}
        loading={cargando}
        getRowId={(row) => row.idSucursal}
        searchLabel="Buscar sucursal"
        searchPlaceholder="Nombre, telefono, email o ciudad"
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
        createLabel="Agregar sucursal"
        onCreate={abrirCrear}
        onRefresh={cargar}
        onEdit={abrirEditarPorId}
        onDeleteOne={eliminarUno}
        onToggleActive={alternarActivo}
        onDeleteMany={eliminarSeleccionados}
      />

      <SucursalModal
        open={modalAbierto}
        modo={modoModal}
        sucursal={sucursalActual}
        ciudades={ciudades}
        colonias={colonias}
        loading={guardando}
        onClose={() => setModalAbierto(false)}
        onSubmit={onGuardar}
      />
    </section>
  );
}
