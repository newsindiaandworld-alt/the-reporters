"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function NavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`relative pb-1 text-sm font-medium tracking-wide transition-all duration-300 ease-out ${
        isActive
          ? "text-slate-900 dark:text-white"
          : "text-slate-600 hover:text-slate-900 dark:text-navy-300 dark:hover:text-white"
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute -bottom-1 left-0 h-px w-full bg-brand-gold transition-all duration-300 ease-out" />
      )}
    </Link>
  );
}
