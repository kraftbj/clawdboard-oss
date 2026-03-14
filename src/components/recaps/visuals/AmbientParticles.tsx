"use client";

import { useMemo } from "react";

interface AmbientParticlesProps {
  count?: number;
  color?: string;
  className?: string;
}

/**
 * Floating ambient particles that drift slowly across the slide.
 * Gives the stories a living, breathing feel.
 */
export function AmbientParticles({
  count = 20,
  color = "rgba(249, 166, 21, 0.15)",
  className = "",
}: AmbientParticlesProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2,
        duration: 15 + Math.random() * 25,
        delay: Math.random() * -20,
        drift: 10 + Math.random() * 20,
      })),
    [count]
  );

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--drift": `${p.drift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
