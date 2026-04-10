export default function LayoutAuth({ title, description, children }) {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-fuchsia-900 via-violet-900 to-purple-900 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl shadow-slate-900/25">
        <h1 className="mb-1 text-3xl font-bold text-slate-900">{title}</h1>
        {description ? <p className="mb-5 text-sm text-slate-500">{description}</p> : null}
        {children}
      </section>
    </main>
  );
}
