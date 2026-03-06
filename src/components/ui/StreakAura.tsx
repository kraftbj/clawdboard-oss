import { getStreakTier } from "@/lib/streak-tiers";

type AuraSize = "sm" | "md" | "lg";

interface StreakAuraProps {
  streak: number;
  size?: AuraSize;
  children: React.ReactNode;
}

const sizeConfig: Record<AuraSize, { padding: string; rounded: string }> = {
  sm: { padding: "p-[2px]", rounded: "rounded-full" },
  md: { padding: "p-[3px]", rounded: "rounded-full" },
  lg: { padding: "p-[4px]", rounded: "rounded-full" },
};

/**
 * Wraps an avatar with a gradient ring whose color, glow, and animation
 * evolve based on the user's current streak tier.
 *
 * Uses the "Instagram Stories" approach: a gradient background on a padded
 * wrapper, with the avatar overlaid via an inner rounded div.
 */
export function StreakAura({ streak, size = "sm", children }: StreakAuraProps) {
  const tier = getStreakTier(streak);
  const { padding, rounded } = sizeConfig[size];

  // Tier 0 — no aura, render children with a neutral ring
  if (tier.tier === 0) {
    return (
      <div className={`${rounded} ring-1 ring-border flex-shrink-0`}>
        {children}
      </div>
    );
  }

  // For spinning tiers (Inferno/Eternal), counter-rotate the inner content
  // so the avatar stays still while the gradient ring rotates.

  return (
    <div
      className={`${rounded} ${padding} ${tier.ringClass} ${tier.glowClass} ${tier.animationClass} flex-shrink-0`}
    >
      <div
        className={`${rounded} bg-background flex items-center justify-center overflow-hidden`}
        style={tier.spins ? { animation: "streak-spin 8s linear infinite reverse" } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
