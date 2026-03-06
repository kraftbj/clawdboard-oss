// src/components/leaderboard/StreakBadge.tsx

import { getStreakTier } from "@/lib/streak-tiers";

export function StreakBadge({ count }: { count: number }) {
  const tier = getStreakTier(count);

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-sm ${tier.textGlow}`}
      title={`${count} day streak — ${tier.name}`}
    >
      {tier.icon && (
        <span className="text-xs">{tier.icon}</span>
      )}
      <span className={`font-semibold tabular-nums ${tier.textColor}`}>{count}</span>
      {tier.tier >= 2 && (
        <span className={`text-[10px] font-medium ${tier.textColor} opacity-70 hidden sm:inline`}>
          {tier.name}
        </span>
      )}
    </span>
  );
}
