import { useState } from 'react';
import Button from '../../../core/components/ui/Button';
import InputText from '../../../core/components/ui/InputText';

export default function ProductosPage() {
  const [filtroCliente, setFiltroCliente] = useState('');
  const [codigoInterno, setCodigoInterno] = useState('A100');

  return (
    <section className="grid gap-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Productos</h2>
        <p className="text-sm text-slate-600">Vista de ejemplo para la seccion admin/productos.</p>
      </header>

      <article className="grid gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
        <InputText
          id="filtroCliente"
          label="Filtro por nombre"
          value={filtroCliente}
          onChange={setFiltroCliente}
          placeholder="Solo letras, numeros y espacios"
          allowSpecialChars={false}
          prefix="@"
        />

        <InputText
          id="codigoInterno"
          label="Codigo interno"
          value={codigoInterno}
          onChange={setCodigoInterno}
          suffix="SKU"
          allowSpecialChars={false}
          maxLength={12}
        />

        <div className="md:col-span-2 flex gap-3">
          <Button>Aplicar filtros</Button>
          <Button variant="ghost" onClick={() => setFiltroCliente('')}>
            Limpiar
          </Button>
        </div>
      </article>
    </section>
  );
}
