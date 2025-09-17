export const metadata = {
  title: "Admin Dashboard — F1 League"
};

const placeholderMetrics = [
  { label: "Seasons", description: "Total seasons in database", value: "—" },
  { label: "Events", description: "Scheduled events", value: "—" },
  { label: "Sessions", description: "Sessions across all events", value: "—" },
  { label: "Results", description: "Individual classified results", value: "—" }
];

export default function AdminDashboardPage() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Admin dashboard</h1>
        <p className="max-w-2xl text-sm text-slate-300">
          A consolidated view of seasons, events, sessions, and audit activity will appear here. We are building out the
          management experience incrementally—core CRUD flows are next on the roadmap.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {placeholderMetrics.map(metric => (
          <div
            key={metric.label}
            className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-4 shadow-sm transition hover:border-slate-700"
          >
            <p className="text-xs uppercase tracking-widest text-slate-400">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{metric.value}</p>
            <p className="mt-3 text-xs text-slate-400">{metric.description}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-6 text-sm text-slate-300">
        <h2 className="text-lg font-semibold text-white">What&apos;s coming next</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Secure CRUD flows for seasons, events, and sessions with optimistic updates.</li>
          <li>Result editing with override auditing for Admins and Stewards.</li>
          <li>CSV/JSON import and export of classification data.</li>
        </ul>
      </div>
    </section>
  );
}
