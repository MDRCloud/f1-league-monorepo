"use client";

import clsx from "clsx";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface SignOutButtonProps {
  className?: string;
}

export function SignOutButton({ className }: SignOutButtonProps) {
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    try {
      setPending(true);
      await signOut({ callbackUrl: "/admin/login" });
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={clsx(
        "inline-flex items-center gap-2 rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-70",
        className
      )}
    >
      <span>Sign out</span>
      {pending && <span className="h-1.5 w-1.5 animate-ping rounded-full bg-slate-300" aria-hidden="true" />}
    </button>
  );
}
