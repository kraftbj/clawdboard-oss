"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";

export function ActivityTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    if (pathname === lastTracked.current) return;
    lastTracked.current = pathname;

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pathname }),
    }).catch(() => {
      // Fire-and-forget — ignore errors
    });
  }, [pathname]);

  return null;
}
