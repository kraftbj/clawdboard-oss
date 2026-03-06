import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

interface LeaderboardToggleProps {
  active: "individuals" | "teams";
}

export async function LeaderboardToggle({ active }: LeaderboardToggleProps) {
  const t = await getTranslations("leaderboard");

  const tabs = [
    { label: t("individuals"), value: "individuals" as const, href: "/" },
    { label: t("teams"), value: "teams" as const, href: "/teams" },
  ];

  return (
    <div className="mb-6 flex items-center rounded-md border border-border bg-surface p-0.5 font-mono text-xs w-fit">
      {tabs.map((tab) => {
        const isActive = active === tab.value;
        return (
          <Link
            key={tab.value}
            href={tab.href}
            className={`rounded-[3px] px-3 py-1.5 font-medium transition-all ${
              isActive
                ? "bg-accent text-background shadow-sm shadow-accent/20"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
