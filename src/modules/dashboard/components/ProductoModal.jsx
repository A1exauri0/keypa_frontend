import { useEffect, useState } from 'react';
import Modal from '../../../core/components/ui/overlays/Modal';
import Button from '../../../core/components/ui/buttons/Button';
import InputText from '../../../core/components/ui/inputs/InputText';
import InputNumber from '../../../core/components/ui/inputs/InputNumber';
import Select from '../../../core/components/ui/selectors/Select';
import ImageUploader from '../../../core/components/ui/media/ImageUploader';
import { slugifyText } from '../../../core/utils/slugify';

const estadoInicial = {
  nombre: '',
  sku: '',
  descripcion: '',
  tipo: 'Maquillaje',
  disponibilidad: 'Disponible',
  precio: '',
  costo: '',
  idMarca: '',
  categorias: [],
  activo: true,
  color: '',
  talla: '',
  tono: '',
  material: '',
  imagenUrl: '',
  imagenFile: null,
};

export default function ProductoModal({
  open,
  modo,
  producto,
  marcas,
  categorias,
  onUploadImage,
  loading,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(estadoInicial);

  const isRopa = form.tipo === 'Ropa';
  const isMaquillaje = form.tipo === 'Maquillaje';
  const isAccesorio = form.tipo === 'Accesorios';

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!producto) {
      setForm(estadoInicial);
      return;
    }

    setForm({
      nombre: producto.nombre || '',
      sku: producto.sku || '',
      descripcion: producto.descripcion || '',
      tipo: producto.tipo || 'Maquillaje',
      disponibilidad: producto.disponibilidad || 'Disponible',
      precio: Number(producto.precio),
      costo: Number(producto.costo),
      idMarca: producto.idMarca || '',
      categorias: (producto.categorias || []).map((item) => item.idCategoria),
      activo: Boolean(producto.activo),
      color: producto.color || '',
      talla: producto.talla || '',
      tono: producto.tono || '',
      material: producto.material || '',
      imagenUrl: producto.imagenes?.[0]?.url || '',
      imagenFile: null,
    });
  }, [open, producto]);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onChangeTipo = (tipo) => {
    setForm((prev) => ({
      ...prev,
      tipo,
      talla: tipo === 'Ropa' ? prev.talla : '',
      material: tipo === 'Ropa' || tipo === 'Accesorios' ? prev.material : '',
      tono: tipo === 'Maquillaje' ? prev.tono : '',
      color: tipo === 'Ropa' || tipo === 'Maquillaje' || tipo === 'Accesorios' ? prev.color : '',
    }));
  };

  const toggleCategoria = (idCategoria) => {
    setForm((prev) => {
      const existe = prev.categorias.includes(idCategoria);
      return {
        ...prev,
        categorias: existe
          ? prev.categorias.filter((id) => id !== idCategoria)
          : [...prev.categorias, idCategoria],
      };
    });
  };

  const normalizarUrlImagen = (url) => {
    if (!url || typeof url !== 'string') {
      return '';
    }

    return url.startsWith('/uploads/') ? url.replace('/uploads/', '/storage/') : url;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let imagenUrlFinal = normalizarUrlImagen(form.imagenUrl);

    if (form.imagenFile) {
      if (!onUploadImage) {
        return;
      }

      const uploaded = await onUploadImage(form.imagenFile);
      imagenUrlFinal = normalizarUrlImagen(uploaded?.url || '');
    }

    const payload = {
      nombre: form.nombre,
      slug: slugifyText(form.nombre),
      sku: form.sku,
      descripcion: form.descripcion || null,
      tipo: form.tipo,
      disponibilidad: form.disponibilidad,
      precio: Number(form.precio),
      costo: Number(form.costo),
      idMarca: Number(form.idMarca),
      categorias: form.categorias,
      activo: form.activo,
      color: isRopa || isMaquillaje || isAccesorio ? form.color || null : null,
      talla: isRopa ? form.talla || null : null,
      tono: isMaquillaje ? form.tono || null : null,
      material: isRopa || isAccesorio ? form.material || null : null,
      imagenes: imagenUrlFinal
        ? [
            {
              url: imagenUrlFinal,
              alt: null,
              orden: 1,
              principal: true,
            },
          ]
        : [],
    };

    onSubmit(payload);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={modo === 'editar' ? 'Actualizar producto' : 'Agregar producto'}
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="productoForm" disabled={loading}>
            {loading ? 'Guardando...' : modo === 'editar' ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      }
    >
      <form id="productoForm" className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
        <InputText id="productoNombre" label="Nombre" value={form.nombre} onChange={(v) => onChange('nombre', v)} required />
        <InputText id="productoSku" label="SKU" value={form.sku} onChange={(v) => onChange('sku', v)} required />
        <InputText id="productoDescripcion" label="Descripcion" value={form.descripcion} onChange={(v) => onChange('descripcion', v)} />

        <InputNumber id="productoPrecio" label="Precio" value={form.precio} onChange={(v) => onChange('precio', v)} min={0.01} step={0.01} required prefix="$" />
        <InputNumber id="productoCosto" label="Costo" value={form.costo} onChange={(v) => onChange('costo', v)} min={0.01} step={0.01} required prefix="$" />

        <Select
          id="productoMarca"
          label="Marca"
          value={String(form.idMarca || '')}
          onChange={(value) => onChange('idMarca', value)}
          placeholder="Selecciona marca"
          options={marcas.map((marca) => ({
            value: String(marca.idMarca),
            label: marca.nombre,
          }))}
        />

        <Select
          id="productoTipo"
          label="Tipo"
          value={form.tipo}
          onChange={onChangeTipo}
          options={[
            { value: 'Ropa', label: 'Ropa' },
            { value: 'Maquillaje', label: 'Maquillaje' },
            { value: 'Accesorios', label: 'Accesorios' },
            { value: 'Otros', label: 'Otros' },
          ]}
        />

        <Select
          id="productoDisponibilidad"
          label="Disponibilidad"
          value={form.disponibilidad}
          onChange={(value) => onChange('disponibilidad', value)}
          options={[
            { value: 'Disponible', label: 'Disponible' },
            { value: 'Pausado', label: 'Pausado' },
            { value: 'Descontinuado', label: 'Descontinuado' },
          ]}
        />

        {isRopa || isMaquillaje || isAccesorio ? (
          <InputText id="productoColor" label="Color" value={form.color} onChange={(v) => onChange('color', v)} />
        ) : null}
        {isRopa ? (
          <InputText id="productoTalla" label="Talla" value={form.talla} onChange={(v) => onChange('talla', v)} />
        ) : null}
        {isMaquillaje ? (
          <InputText id="productoTono" label="Tono" value={form.tono} onChange={(v) => onChange('tono', v)} />
        ) : null}
        {isRopa || isAccesorio ? (
          <InputText id="productoMaterial" label="Material" value={form.material} onChange={(v) => onChange('material', v)} />
        ) : null}

        <div className="md:col-span-2">
          <ImageUploader
            id="productoImagen"
            label="Imagen del producto"
            imageUrl={form.imagenUrl}
            imageFile={form.imagenFile}
            onChange={({ imageUrl, imageFile }) => {
              if (imageUrl !== undefined) {
                onChange('imagenUrl', imageUrl);
              }
              if (imageFile !== undefined) {
                onChange('imagenFile', imageFile);
              }
            }}
          />
        </div>

        <div className="md:col-span-2 grid gap-1.5">
          <span className="text-sm font-medium text-slate-700">Categorias</span>
          <div className="flex flex-wrap gap-2">
            {categorias.map((categoria) => {
              const checked = form.categorias.includes(categoria.idCategoria);
              return (
                <button
                  type="button"
                  key={categoria.idCategoria}
                  onClick={() => toggleCategoria(categoria.idCategoria)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    checked
                      ? 'bg-fuchsia-600 text-white'
                      : 'bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-200'
                  }`}
                >
                  {categoria.nombre}
                </button>
              );
            })}
          </div>
        </div>
      </form>
    </Modal>
  );
}
