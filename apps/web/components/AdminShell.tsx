import type { Session } from "next-auth";
import Link from "next/link";
import { AdminNav, type AdminNavItem } from "./AdminNav";
import { SignOutButton } from "./SignOutButton";

const navItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/seasons", label: "Seasons" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/results/import", label: "Import / Export" },
  { href: "/admin/embed", label: "Embed Tokens" }
];

interface AdminShellProps {
  session: Session;
  children: React.ReactNode;
}

export default function AdminShell({ session, children }: AdminShellProps) {
  const roleList = session.roles?.length ? session.roles : session.user?.roles ?? [];
  const primaryRole = roleList[0] ?? "Unknown";

  return (
    <div className="flex min-h-screen bg-slate-950">
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-900/80 p-6 sm:flex">
        <div className="mb-10 space-y-3">
          <Link href="/admin" className="block text-lg font-semibold text-white">
            F1 League Admin
          </Link>
          <div className="space-y-1 text-xs text-slate-400">
            <p className="font-medium text-slate-200">{session.user?.email ?? "Unknown user"}</p>
            <div className="flex flex-wrap gap-1">
              {roleList.map(role => (
                <span
                  key={role}
                  className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-200"
                >
                  {role}
                </span>
              ))}
              {!roleList.length && (
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-200">
                  UNKNOWN
                </span>
              )}
            </div>
          </div>
        </div>
        <AdminNav items={navItems} />
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex flex-col gap-2 border-b border-slate-800/80 bg-slate-950/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Signed in as</p>
            <p className="text-sm font-semibold text-white">{session.user?.email ?? "Unknown user"}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-md border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium uppercase tracking-widest text-slate-300 sm:inline-flex">
              {primaryRole}
            </span>
            <SignOutButton />
          </div>
        </header>
        <div className="border-b border-slate-800/80 bg-slate-900/70 p-3 sm:hidden">
          <AdminNav items={navItems} />
        </div>
        <main className="flex-1 space-y-6 bg-slate-950 p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
