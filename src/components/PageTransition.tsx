"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

/**
 * Replays a lightweight CSS fade-in-up on every route change.
 * Keying by pathname forces React to remount the wrapper (and thus
 * restart the CSS animation) — no JS animation library involved.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="animate-fade-in-up">
      {children}
    </div>
  );
}
