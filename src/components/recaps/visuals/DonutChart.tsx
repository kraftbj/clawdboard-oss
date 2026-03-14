"use client";

interface DonutChartProps {
  segments: { name: string; percentage: number; color: string }[];
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const COLORS = ["#F9A615", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899"];

/**
 * Animated donut chart for model breakdown.
 * Segments animate in sequentially for a satisfying reveal.
 */
export function DonutChart({
  segments,
  size = 140,
  strokeWidth = 14,
  className = "",
}: DonutChartProps) {
  if (segments.length === 0) return null;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Build segments with offsets
  let offset = 0;
  const arcs = segments.map((seg, i) => {
    const dashLength = (seg.percentage / 100) * circumference;
    const dashGap = circumference - dashLength;
    const rotation = (offset / 100) * 360 - 90; // -90 to start from top
    offset += seg.percentage;

    return (
      <circle
        key={seg.name}
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={seg.color || COLORS[i % COLORS.length]}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dashLength} ${dashGap}`}
        strokeLinecap="round"
        transform={`rotate(${rotation}, ${center}, ${center})`}
        className="animate-donut-segment"
        style={{
          animationDelay: `${1400 + i * 200}ms`,
          opacity: 0,
        }}
      />
    );
  });

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-0"
      >
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        {arcs}
      </svg>
      {/* Center label */}
      {segments[0] && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in"
          style={{ animationDelay: "1800ms" }}
        >
          <span className="font-mono text-[10px] text-white/30 leading-none">top</span>
          <span className="font-display text-sm font-bold text-white leading-tight">
            {segments[0].name}
          </span>
        </div>
      )}
    </div>
  );
}
