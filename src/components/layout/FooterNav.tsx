import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

const linkCn = "font-mono text-xs text-muted hover:text-accent transition-colors";

export async function FooterNav({ className }: { className?: string }) {
  const t = await getTranslations("nav");

  return (
    <div className={`flex items-center justify-between ${className ?? ""}`}>
      <Link href="/" className={linkCn}>
        {t("backToLeaderboard")}
      </Link>
      <Link href="/teams" className={linkCn}>
        {t("teamRankings")} &rarr;
      </Link>
    </div>
  );
}
