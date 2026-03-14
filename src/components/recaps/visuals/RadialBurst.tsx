"use client";

import type { RecapData } from "@/lib/db/schema";

interface RadialBurstProps {
  tier: RecapData["stateTier"];
  className?: string;
}

/**
 * Radial starburst behind the rank number.
 * Intensity and color scale with tier.
 */
export function RadialBurst({ tier, className = "" }: RadialBurstProps) {
  if (tier === "empty" || tier === "low") return null;

  const config = {
    normal: { rays: 12, opacity: 0.04, color: "#F9A615", size: 200 },
    top10pct: { rays: 16, opacity: 0.08, color: "#F9A615", size: 250 },
    top10: { rays: 24, opacity: 0.12, color: "#F97316", size: 300 },
    podium: { rays: 32, opacity: 0.18, color: "#FFD700", size: 350 },
  };

  const c = config[tier];

  const rays = Array.from({ length: c.rays }, (_, i) => {
    const angle = (360 / c.rays) * i;
    const width = tier === "podium" ? 2 : 1.5;
    return (
      <line
        key={i}
        x1="50"
        y1="50"
        x2={50 + 45 * Math.cos((angle * Math.PI) / 180)}
        y2={50 + 45 * Math.sin((angle * Math.PI) / 180)}
        stroke={c.color}
        strokeWidth={width}
        strokeOpacity={c.opacity * (0.5 + Math.random() * 0.5)}
        strokeLinecap="round"
      />
    );
  });

  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: c.size,
        height: c.size,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full animate-radial-spin"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Glow circle */}
        <circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke={c.color}
          strokeWidth="0.5"
          strokeOpacity={c.opacity * 0.5}
        />
        <circle
          cx="50"
          cy="50"
          r="20"
          fill={`${c.color}${Math.round(c.opacity * 40).toString(16).padStart(2, "0")}`}
          filter="blur(8px)"
        />
        {rays}
      </svg>
    </div>
  );
}
