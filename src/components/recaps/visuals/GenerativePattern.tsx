"use client";

import { useMemo } from "react";

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStats(rank: number, cost: number, streak: number): number {
  return Math.floor(rank * 7919 + cost * 104729 + streak * 3571);
}

interface GenerativePatternProps {
  rank: number;
  totalCost: number;
  streak: number;
  tier: "empty" | "low" | "normal" | "top10pct" | "top10" | "podium";
  className?: string;
  variant?: "geometric" | "circuits";
}

/**
 * Subtle edge-only decorative pattern.
 * Shapes hug corners/edges — never overlap centered content.
 */
export function GenerativePattern({
  rank,
  totalCost,
  streak,
  tier,
  className = "",
  variant = "geometric",
}: GenerativePatternProps) {
  const elements = useMemo(() => {
    const seed = hashStats(rank, totalCost, streak);
    const rng = mulberry32(seed);

    const opacity = {
      empty: 0.06,
      low: 0.08,
      normal: 0.10,
      top10pct: 0.12,
      top10: 0.14,
      podium: 0.16,
    }[tier];

    const count = tier === "podium" ? 12 : tier === "top10" ? 10 : 8;

    if (variant === "geometric") {
      return Array.from({ length: count }, (_, i) => {
        // Push to edges: pick a corner quadrant
        const corner = i % 4;
        const x = corner % 2 === 0 ? rng() * 25 : 75 + rng() * 25;
        const y = corner < 2 ? rng() * 25 : 75 + rng() * 25;
        const size = 10 + rng() * 25;
        const rotation = rng() * 360;
        const o = opacity * (0.5 + rng() * 0.5);
        const color = `rgba(249,166,21,${o})`;

        const shape = rng();
        if (shape < 0.4) {
          const r = size / 2;
          const pts = Array.from({ length: 6 }, (_, j) => {
            const angle = (Math.PI / 3) * j - Math.PI / 6;
            return `${r + r * Math.cos(angle)},${r + r * Math.sin(angle)}`;
          }).join(" ");
          return (
            <polygon
              key={i}
              points={pts}
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              transform={`translate(${x - size / 2}, ${y - size / 2}) rotate(${rotation}, ${size / 2}, ${size / 2})`}
            />
          );
        } else if (shape < 0.7) {
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={size / 2}
              fill="none"
              stroke={color}
              strokeWidth="0.5"
            />
          );
        } else {
          const h = size * 0.866;
          return (
            <polygon
              key={i}
              points={`${size / 2},0 ${size},${h} 0,${h}`}
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              transform={`translate(${x - size / 2}, ${y - h / 2}) rotate(${rotation}, ${size / 2}, ${h / 2})`}
            />
          );
        }
      });
    }

    // Circuits — corner-only
    const lines: React.ReactNode[] = [];
    for (let i = 0; i < count; i++) {
      const corner = i % 4;
      const bx = corner % 2 === 0 ? rng() * 20 : 80 + rng() * 20;
      const by = corner < 2 ? rng() * 25 : 75 + rng() * 25;
      const o = opacity * (0.4 + rng() * 0.6);
      const color = `rgba(249,166,21,${o})`;

      let cx = bx;
      let cy = by;
      const parts = [`M ${cx} ${cy}`];

      for (let s = 0; s < 2 + Math.floor(rng() * 2); s++) {
        if (rng() > 0.5) {
          cx += (rng() - 0.3) * 18;
          cx = Math.max(0, Math.min(100, cx));
          parts.push(`H ${cx}`);
        } else {
          cy += (rng() - 0.3) * 18;
          cy = Math.max(0, Math.min(100, cy));
          parts.push(`V ${cy}`);
        }
      }

      lines.push(
        <g key={`c-${i}`}>
          <path d={parts.join(" ")} fill="none" stroke={color} strokeWidth="0.4" strokeLinecap="round" />
          <circle cx={bx} cy={by} r="1" fill={color} />
          <circle cx={cx} cy={cy} r="0.7" fill={color} />
        </g>
      );
    }
    return lines;
  }, [rank, totalCost, streak, tier, variant]);

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {elements}
    </svg>
  );
}
