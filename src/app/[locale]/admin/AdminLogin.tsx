"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";

export function AdminLogin({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!configured) {
    return (
      <div className="text-center">
        <p className="text-sm text-muted font-mono">
          ADMIN_PASSWORD not set. Add it to your environment to enable the admin
          dashboard.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Authentication failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
      <h1 className="font-display text-lg font-bold text-foreground text-center">
        <span className="text-accent">$</span> admin --login
      </h1>
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="w-full rounded border border-border bg-surface px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>
      {error && (
        <p className="text-xs text-danger font-mono text-center">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading || !password}
        className="w-full rounded bg-accent px-3 py-2 text-sm font-mono font-semibold text-background hover:bg-accent/90 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Authenticating..." : "Log in"}
      </button>
    </form>
  );
}
