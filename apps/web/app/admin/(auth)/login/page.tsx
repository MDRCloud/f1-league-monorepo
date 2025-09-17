import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import LoginForm from "./login-form";

export const metadata = {
  title: "Admin Login — F1 League"
};

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-slate-800/80 bg-slate-900/80 p-8 shadow-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-white">Sign in to F1 League</h1>
          <p className="text-sm text-slate-400">
            Use your administrator or steward credentials to access the control centre.
          </p>
        </div>
        <LoginForm />
        <p className="text-center text-xs text-slate-500">
          Need help? Refer to the project README for seeded account credentials.
        </p>
      </div>
    </main>
  );
}
