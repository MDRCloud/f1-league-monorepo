export const metadata = {
  title: "Import & Export Results — F1 League"
};

export default function AdminResultsImportPage() {
  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Import &amp; export results</h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Upload CSV/JSON classification files, run a dry-run validation, and push overrides to the league database from this
          screen. The importer and preview UI will be implemented in a follow-up iteration.
        </p>
      </header>
      <div className="rounded-lg border border-slate-800/80 bg-slate-900/50 p-6 text-sm text-slate-300">
        <p>
          While the UI is being built you can POST files to
          <code className="mx-1 rounded bg-slate-800 px-1.5 py-0.5 text-xs text-slate-200">/api/v1/admin/import/results</code>
          and download via
          <code className="mx-1 rounded bg-slate-800 px-1.5 py-0.5 text-xs text-slate-200">/api/v1/export/results</code>.
        </p>
      </div>
    </section>
  );
}
