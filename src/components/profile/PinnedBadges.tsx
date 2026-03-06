"use client";

import type { EarnedBadge } from "@/lib/badges";
import { KitchenRankIcon } from "@/components/icons/KitchenRankIcons";
import type { KitchenRank } from "@/lib/kitchen-rank";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface PinnedBadgesProps {
  pinnedBadges: EarnedBadge[];
  kitchenRank: KitchenRank;
  isOwner: boolean;
}

export function PinnedBadges({
  pinnedBadges,
  kitchenRank,
  isOwner,
}: PinnedBadgesProps) {
  const t = useTranslations("profile");
  if (pinnedBadges.length === 0 && !isOwner) return null;

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className={kitchenRank.color}>
          <KitchenRankIcon tier={kitchenRank.tier} className="h-4 w-4" />
        </span>
        <span className={`font-mono text-xs font-bold ${kitchenRank.color}`}>
          {kitchenRank.title}
        </span>
      </div>

      {pinnedBadges.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {pinnedBadges.map((badge) => (
            <span
              key={badge.definition.id}
              className="rounded-md border border-accent/30 bg-accent/5 px-2 py-1 font-mono text-[11px] text-foreground"
              title={badge.definition.description}
            >
              {badge.definition.label}
            </span>
          ))}
        </div>
      ) : isOwner ? (
        <p className="font-mono text-[10px] text-dim">
          {t("noBadgesPinned")}{" "}
          <Link
            href="/settings"
            className="text-accent hover:text-accent/80 transition-colors"
          >
            {t("pinBadgesInSettings")} &rarr;
          </Link>
        </p>
      ) : null}
    </div>
  );
}
