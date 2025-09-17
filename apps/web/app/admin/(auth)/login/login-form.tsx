"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required.")
});

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState<string[]>([]);
  const [pending, setPending] = useState(false);

  const callbackUrl = searchParams?.get("callbackUrl") ?? "/admin";
  const errorParam = searchParams?.get("error");

  useEffect(() => {
    if (!errorParam) return;
    const message = errorParam === "CredentialsSignin" ? "Invalid email or password." : errorParam;
    setErrors([message]);
  }, [errorParam]);

  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={async event => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const values = {
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? "")
        };
        const parsed = formSchema.safeParse(values);
        if (!parsed.success) {
          setErrors(parsed.error.errors.map(issue => issue.message));
          return;
        }

        setErrors([]);
        setPending(true);
        try {
          const result = await signIn("credentials", {
            ...parsed.data,
            redirect: false,
            callbackUrl
          });

          if (result?.error) {
            const message = result.error === "CredentialsSignin" ? "Invalid email or password." : result.error;
            setErrors([message ?? "Unable to sign in."]);
            setPending(false);
            return;
          }

          const destination = result?.url ?? callbackUrl;
          router.push(destination);
          router.refresh();
        } catch (error) {
          console.error(error);
          setErrors(["Unexpected error during sign-in. Please try again."]);
          setPending(false);
        }
      }}
    >
      <div className="space-y-1 text-left">
        <label htmlFor="email" className="text-sm font-medium text-slate-200">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/60"
        />
      </div>
      <div className="space-y-1 text-left">
        <label htmlFor="password" className="text-sm font-medium text-slate-200">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/60"
        />
      </div>
      {errors.length > 0 && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-100" role="alert">
          <ul className="list-disc space-y-1 pl-4 text-left">
            {errors.map((error, index) => (
              <li key={`${error}-${index}`}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
