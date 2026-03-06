import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const t = useTranslations("errors");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="text-4xl opacity-40">&gt;_</span>
        <p className="font-mono text-7xl font-bold text-foreground/10">404</p>
        <h1 className="font-display text-xl font-bold text-foreground">
          {t("pageNotFound")}
        </h1>
        <p className="max-w-sm text-sm text-muted">
          {t("pageNotFoundDescription")}
        </p>
        <Link
          href="/"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent/90"
        >
          {t("backToLeaderboard")}
        </Link>
      </div>
    </div>
  );
}
