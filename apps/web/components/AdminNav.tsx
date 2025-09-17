"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface AdminNavItem {
  href: string;
  label: string;
}

interface AdminNavProps {
  items: AdminNavItem[];
}

export function AdminNav({ items }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {items.map(item => {
        const isActive =
          pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "rounded-md px-3 py-2 text-sm font-medium transition",
              isActive
                ? "bg-slate-800 text-white shadow"
                : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
