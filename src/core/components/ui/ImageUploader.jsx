import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';
import InputText from './InputText';

export default function ImageUploader({
  id,
  label = 'Imagen',
  imageUrl,
  imageFile,
  onChange,
}) {
  const [previewUrl, setPreviewUrl] = useState('');
  const [localFileName, setLocalFileName] = useState('');
  const localObjectUrlRef = useRef('');

  const resolverUrlImagen = (value) => {
    if (!value) {
      return '';
    }

    if (
      value.startsWith('http://') ||
      value.startsWith('https://') ||
      value.startsWith('blob:') ||
      value.startsWith('data:')
    ) {
      return value;
    }

    if (value.startsWith('//')) {
      return `https:${value}`;
    }

    const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');
    const normalizedPath = value.startsWith('/uploads/')
      ? value.replace('/uploads/', '/storage/')
      : value;

    return `${apiBase}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
  };

  useEffect(() => {
    if (imageFile) {
      if (localObjectUrlRef.current) {
        URL.revokeObjectURL(localObjectUrlRef.current);
      }

      const nextPreview = URL.createObjectURL(imageFile);
      localObjectUrlRef.current = nextPreview;
      setPreviewUrl(nextPreview);
      setLocalFileName(imageFile.name || 'archivo seleccionado');
      return;
    }

    setPreviewUrl(resolverUrlImagen(imageUrl || ''));
    setLocalFileName('');
  }, [imageUrl, imageFile]);

  useEffect(() => {
    return () => {
      if (localObjectUrlRef.current) {
        URL.revokeObjectURL(localObjectUrlRef.current);
      }
    };
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    onChange({ imageFile: file });

    event.target.value = '';
  };

  const handleRemoveImage = () => {
    if (localObjectUrlRef.current) {
      URL.revokeObjectURL(localObjectUrlRef.current);
      localObjectUrlRef.current = '';
    }

    setPreviewUrl('');
    setLocalFileName('');
    onChange({ imageUrl: '', imageFile: null });
  };

  return (
    <div className="grid gap-2">
      <p className="text-sm font-medium text-slate-700">{label}</p>

      <div className="grid gap-3 md:grid-cols-[1fr_170px]">
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
          <div className="mb-2 flex items-center gap-2">
            <label htmlFor={id}>
              <input id={id} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <span className="inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-xl bg-fuchsia-600 px-3 text-sm font-semibold text-white transition hover:bg-fuchsia-700">
                <Icon icon="mdi:upload" width="14" />
                Elegir
              </span>
            </label>
            {localFileName ? <span className="truncate text-xs text-slate-500">{localFileName}</span> : null}
          </div>

          <div className="mb-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={!imageUrl && !imageFile && !previewUrl}
              className="inline-flex h-8 items-center justify-center gap-2 rounded-xl bg-rose-600 px-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon icon="mdi:trash-can-outline" width="14" />
              Eliminar imagen
            </button>
          </div>

          <InputText
            id={`${id}-url`}
            label="URL imagen"
            value={imageUrl}
            onChange={(value) => onChange({ imageUrl: value })}
            placeholder="https://..."
          />
          <p className="mt-1 text-xs text-slate-500">
            La imagen se sube solo cuando presionas Guardar o Actualizar en el modal.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {previewUrl ? (
            <img src={previewUrl} alt="Previsualizacion de imagen" className="h-32 w-full object-cover" />
          ) : (
            <div className="grid h-32 place-items-center text-center text-xs text-slate-400">
              Sin
              <br />
              preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
