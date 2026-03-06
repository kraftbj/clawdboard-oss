"use client";

import { useTranslations } from "next-intl";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-danger/30 bg-danger/10">
          <span className="text-3xl font-bold text-danger">!</span>
        </div>
        <h1 className="font-display text-xl font-bold text-foreground">
          {t("somethingWentWrong")}
        </h1>
        <p className="max-w-sm text-sm text-muted">
          {t("errorDescription")}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => reset()}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent/90"
          >
            {t("tryAgain")}
          </button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- intentional: router state may be corrupted after error */}
          <a
            href="/"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            {t("goHome")}
          </a>
        </div>
      </div>
    </div>
  );
}
