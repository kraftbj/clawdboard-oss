"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, Link } from "@/i18n/navigation";

export function DeviceSuccess() {
  const router = useRouter();
  const [synced, setSynced] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  const pollSync = useCallback(async () => {
    try {
      const res = await fetch("/api/me/sync-status");
      if (res.ok) {
        const data = await res.json();
        if (data.synced) {
          setSynced(true);
          return true;
        }
      }
    } catch {
      // Network error — keep polling
    }
    return false;
  }, []);

  useEffect(() => {
    let cancelled = false;

    // Poll every 2 seconds until synced
    const interval = setInterval(async () => {
      if (cancelled) return;
      const done = await pollSync();
      if (done && !cancelled) {
        clearInterval(interval);
        router.push("/");
      }
    }, 2000);

    // Fallback: show manual link after 30 seconds
    const timeout = setTimeout(() => {
      if (!cancelled) {
        clearInterval(interval);
        setTimedOut(true);
      }
    }, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pollSync, router]);

  return (
    <div className="mt-6 rounded-md border border-success/30 bg-success/10 p-4">
      <p className="font-mono text-sm text-success">
        <span className="mr-2">&#10003;</span>
        Device authorized!
      </p>

      {timedOut ? (
        <Link
          href="/"
          className="mt-2 inline-block font-mono text-[11px] text-accent hover:text-accent-bright transition-colors"
        >
          Go to leaderboard &rarr;
        </Link>
      ) : synced ? (
        <p className="mt-2 font-mono text-[11px] text-muted">
          Taking you to the leaderboard...
        </p>
      ) : (
        <>
          <p className="mt-2 font-mono text-[11px] text-muted">
            Syncing your data &mdash; usually takes about 10 seconds.
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-success/10">
            <div
              className="h-full w-1/3 rounded-full bg-accent"
              style={{
                animation: "pulse-bar 1.5s ease-in-out infinite",
              }}
            />
          </div>
          <style>{`
            @keyframes pulse-bar {
              0% { transform: translateX(-100%); opacity: 0.6; }
              50% { opacity: 1; }
              100% { transform: translateX(300%); opacity: 0.6; }
            }
          `}</style>
        </>
      )}
    </div>
  );
}
