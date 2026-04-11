import { useState } from 'react';


const metricas = [
  { titulo: 'Pedidos hoy', valor: '28', color: 'text-emerald-600' },
  { titulo: 'Ventas del dia', valor: '$12,430', color: 'text-blue-700' },
  { titulo: 'Stock critico', valor: '7', color: 'text-amber-600' },
];

export default function DashboardPage() {
  const [metaVentas, setMetaVentas] = useState(10000);

  return (
    <section className="grid gap-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-600">Vista inicial del panel admin con componentes propios.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {metricas.map((item) => (
          <article key={item.titulo} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">{item.titulo}</p>
            <p className={`mt-2 text-3xl font-bold ${item.color}`}>{item.valor}</p>
          </article>
        ))}
      </div>

    </section>
  );
}
