import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import AdminShell from "@/components/AdminShell";
import { authOptions } from "@/lib/auth";

const privilegedRoles = new Set(["ADMIN", "STEWARD"]);

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const roles = session.roles?.length ? session.roles : session.user?.roles ?? [];
  const isAllowed = roles.some(role => privilegedRoles.has(role));

  if (!isAllowed) {
    return (
      <AdminShell session={session}>
        <div className="mx-auto max-w-xl rounded-lg border border-amber-500/40 bg-amber-500/10 p-6 text-sm text-amber-100">
          <h2 className="text-lg font-semibold text-amber-100">Access restricted</h2>
          <p className="mt-2 text-amber-200">
            Your account does not have the necessary role to access administrative tooling. Please contact a league
            administrator if you believe this is an error.
          </p>
        </div>
      </AdminShell>
    );
  }

  return <AdminShell session={session}>{children}</AdminShell>;
}
