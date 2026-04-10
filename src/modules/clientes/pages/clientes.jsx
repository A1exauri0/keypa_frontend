import { useEffect, useMemo, useState } from "react";
import Crud from "../../../core/components/ui/complex/Crud";
import { useToast } from "../../../core/components/ui/feedback/Toast";
import ClienteModal from "../components/ClienteModal";
import {
  actualizarCliente,
  crearCliente,
  eliminarClientesMultiples,
  listarClientes,
} from "../services/clientesService";
import { listarCiudades } from "../../ubicaciones/services/ciudadesService";
import { listarColonias } from "../../ubicaciones/services/coloniasService";

export default function ClientesPage() {
  const { toast } = useToast();
  const [clientes, setClientes] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [colonias, setColonias] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [filtroActivo, setFiltroActivo] = useState("todos");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState("crear");
  const [clienteActual, setClienteActual] = useState(null);

  const cargar = async () => {
    setCargando(true);
    try {
      const [clientesData, ciudadesData, coloniasData] = await Promise.all([
        listarClientes(),
        listarCiudades(),
        listarColonias(),
      ]);

      setClientes(clientesData);
      setCiudades(ciudadesData);
      setColonias(coloniasData);
    } catch (error) {
      toast({
        title: "No se pudieron cargar clientes",
        message: error.response?.data?.message,
        variant: "danger",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const clientesFiltrados = useMemo(() => {
    const q = filtro.trim().toLowerCase();

    return clientes.filter((item) => {
      const nombreCompleto =
        `${item.nombre || ""} ${item.apellidos || ""}`.toLowerCase();
      const matchBusqueda =
        !q ||
        nombreCompleto.includes(q) ||
        (item.email || "").toLowerCase().includes(q) ||
        (item.telefono || "").toLowerCase().includes(q) ||
        (item.ciudad?.nombre || "").toLowerCase().includes(q);

      const matchActivo =
        filtroActivo === "todos" ||
        (filtroActivo === "activos" && item.activo) ||
        (filtroActivo === "inactivos" && !item.activo);

      return matchBusqueda && matchActivo;
    });
  }, [clientes, filtro, filtroActivo]);

  const columnas = [
    {
      key: "nombre",
      label: "Cliente",
      render: (row) => `${row.nombre} ${row.apellidos}`,
    },

    { key: "email", label: "Email", render: (row) => row.email || "-" },
    { key: "telefono", label: "Telefono" },
    {
      key: "genero",
      label: "Genero",
      render: (row) => row.genero || "-",
    },
    {
      key: "ubicacion",
      label: "Ubicacion",
      render: (row) => {
        const ciudad = row.ciudad?.nombre || "-";
        const colonia = row.colonia?.nombre || "-";
        return `${ciudad} / ${colonia}`;
      },
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
            row.activo
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {row.activo ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ];

  const abrirCrear = () => {
    setModoModal("crear");
    setClienteActual(null);
    setModalAbierto(true);
  };

  const abrirEditarPorId = (idCliente) => {
    const cliente = clientes.find((item) => item.idCliente === idCliente);
    if (!cliente) {
      return;
    }

    setModoModal("editar");
    setClienteActual(cliente);
    setModalAbierto(true);
  };

  const onGuardar = async (payload) => {
    setGuardando(true);
    try {
      if (modoModal === "editar" && clienteActual) {
        await actualizarCliente(clienteActual.idCliente, payload);
        toast({ title: "Cliente actualizado", variant: "success" });
      } else {
        await crearCliente(payload);
        toast({ title: "Cliente creado", variant: "success" });
      }

      setModalAbierto(false);
      await cargar();
    } catch (error) {
      toast({
        title: "No se pudo guardar",
        message:
          error.response?.data?.message || "Verifica los datos enviados.",
        variant: "danger",
      });
    } finally {
      setGuardando(false);
    }
  };

  const eliminarSeleccionados = async (ids, onDone) => {
    try {
      await eliminarClientesMultiples(ids);
      toast({ title: "Clientes eliminados", variant: "warning" });
      onDone();
      await cargar();
    } catch (error) {
      toast({
        title: "No se pudo eliminar",
        message:
          error.response?.data?.message ||
          "No fue posible eliminar la seleccion actual.",
        variant: "danger",
      });
    }
  };

  const alternarActivo = async (cliente) => {
    try {
      await actualizarCliente(cliente.idCliente, { activo: !cliente.activo });
      toast({
        title: cliente.activo ? "Cliente desactivado" : "Cliente activado",
        variant: "success",
      });
      await cargar();
    } catch (error) {
      toast({
        title: "No se pudo cambiar estado",
        message: error.response?.data?.message,
        variant: "danger",
      });
    }
  };

  const eliminarUno = async (idCliente) => {
    try {
      await eliminarClientesMultiples([idCliente]);
      toast({ title: "Cliente eliminado", variant: "warning" });
      await cargar();
    } catch (error) {
      toast({
        title: "No se pudo eliminar",
        message:
          error.response?.data?.message ||
          "No fue posible eliminar el cliente.",
        variant: "danger",
      });
    }
  };

  return (
    <section className="grid gap-6">
      <Crud
        title="Clientes"
        description="Listado de clientes con acciones por seleccion."
        rows={clientesFiltrados}
        columns={columnas}
        loading={cargando}
        getRowId={(row) => row.idCliente}
        searchLabel="Buscar cliente"
        searchPlaceholder="Nombre, email, telefono o ciudad"
        searchValue={filtro}
        onSearchChange={setFiltro}
        filterLabel="Estado"
        filterValue={filtroActivo}
        onFilterChange={setFiltroActivo}
        filterOptions={[
          { value: "todos", label: "Todos" },
          { value: "activos", label: "Activos" },
          { value: "inactivos", label: "Inactivos" },
        ]}
        createLabel="Agregar cliente"
        onCreate={abrirCrear}
        onRefresh={cargar}
        onEdit={abrirEditarPorId}
        onDeleteOne={eliminarUno}
        onToggleActive={alternarActivo}
        onDeleteMany={eliminarSeleccionados}
      />

      <ClienteModal
        open={modalAbierto}
        modo={modoModal}
        cliente={clienteActual}
        ciudades={ciudades}
        colonias={colonias}
        loading={guardando}
        onClose={() => setModalAbierto(false)}
        onSubmit={onGuardar}
      />
    </section>
  );
}
