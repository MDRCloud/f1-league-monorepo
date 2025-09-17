export const metadata = {
  title: "Manage Events — F1 League"
};

export default function AdminEventsPage() {
  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Events</h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Event scheduling tools, filters by season, and quick access to session management will live here. We&apos;re building
          the forms and validation layers next.
        </p>
      </header>
      <div className="rounded-lg border border-slate-800/80 bg-slate-900/50 p-6 text-sm text-slate-300">
        <p>
          Until the UI ships you can continue operating via the API endpoint
          <code className="mx-1 rounded bg-slate-800 px-1.5 py-0.5 text-xs text-slate-200">/api/v1/admin/events</code>.
        </p>
      </div>
    </section>
  );
}
