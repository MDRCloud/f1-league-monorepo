export const metadata = {
  title: "Embed Tokens — F1 League"
};

export default function AdminEmbedTokensPage() {
  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Public embed tokens</h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Generate scoped tokens for public standings and event widgets, preview embeddable snippets, and revoke access when
          needed. Token management and rate limiting controls will land shortly.
        </p>
      </header>
      <div className="rounded-lg border border-slate-800/80 bg-slate-900/50 p-6 text-sm text-slate-300">
        <p>
          Token issuance APIs will arrive alongside the embed widgets. Until then, no public widgets are exposed.
        </p>
      </div>
    </section>
  );
}
