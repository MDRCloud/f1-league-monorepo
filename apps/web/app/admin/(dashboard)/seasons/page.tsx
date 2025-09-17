export const metadata = {
  title: "Manage Seasons — F1 League"
};

export default function AdminSeasonsPage() {
  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Seasons</h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Create new seasons, adjust championship metadata, and configure the default points model. The interactive editor
          and validation flows will arrive in the next milestone.
        </p>
      </header>
      <div className="rounded-lg border border-slate-800/80 bg-slate-900/50 p-6 text-sm text-slate-300">
        <p>
          The CRUD interface is under construction. For now you can continue using the REST endpoints documented at
          <code className="mx-1 rounded bg-slate-800 px-1.5 py-0.5 text-xs text-slate-200">/api/v1/admin/seasons</code> to
          seed data.
        </p>
      </div>
    </section>
  );
}
