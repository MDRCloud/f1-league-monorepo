import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">F1 League Control Centre</h1>
        <p className="text-base text-slate-300 sm:text-lg">
          Manage your seasons, events, sessions, and race results through the admin dashboard.
          Sign in with an administrator or steward account to continue.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm font-medium">
          <Link
            href="/admin/login"
            className="rounded-md bg-sky-500 px-4 py-2 text-white shadow transition hover:bg-sky-400"
          >
            Go to admin login
          </Link>
          <Link
            href="/api/docs"
            className="rounded-md border border-slate-700 px-4 py-2 text-slate-200 transition hover:border-slate-500 hover:text-white"
          >
            API reference
          </Link>
        </div>
      </div>
    </main>
  );
}
