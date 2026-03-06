"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { CopyIconButton } from "./CopyIconButton";

const DISMISS_KEY = "clawdboard:sync-banner-dismissed";

export function SyncBanner({ username }: { username?: string | null }) {
  const [dismissed, setDismissed] = useState(true); // default hidden to avoid flash
  const t = useTranslations("syncBanner");

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  if (dismissed) return null;

  return (
    <div className="relative z-20 overflow-hidden bg-accent/10 border-b border-accent/20">
      <div className="relative mx-auto flex max-w-5xl items-center justify-center gap-3 px-12 py-2.5 sm:px-16">
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-mono text-xs leading-relaxed text-foreground/70">
          <span>
            {t("message", { username: username ?? "there" })}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded border border-accent/25 bg-background/80 px-2.5 py-1 text-xs">
            <span className="text-accent/50 select-none">$</span>
            <code className="text-accent">npx clawdboard</code>
            <CopyIconButton text="npx clawdboard" />
          </span>
          <span>{t("cta")}</span>
        </p>

        <button
          onClick={() => {
            localStorage.setItem(DISMISS_KEY, "1");
            setDismissed(true);
          }}
          className="absolute right-4 shrink-0 rounded p-1 font-mono text-foreground/30 transition-colors hover:text-foreground sm:right-6"
          aria-label={t("dismiss")}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
