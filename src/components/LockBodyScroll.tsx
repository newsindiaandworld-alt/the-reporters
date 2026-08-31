"use client";

import { useEffect } from "react";

/**
 * The Shorts-style homepage owns its own internal scroll (the snap
 * container in ShortsFeed). This prevents the outer document from also
 * being scrollable while this page is mounted, so there's only ever one
 * scroll region and no stray browser scrollbar. Reverts on unmount, so
 * every other route keeps normal page scrolling.
 */
export default function LockBodyScroll() {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return null;
}
