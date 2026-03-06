// src/components/leaderboard/RankMovement.tsx

interface RankMovementProps {
  delta: number | null;
}

export function RankMovement({ delta }: RankMovementProps) {
  if (delta === null) {
    return <span className="text-xs font-semibold text-accent">NEW</span>;
  }

  if (delta > 0) {
    return (
      <span className="text-xs font-semibold text-success">
        &#9650; +{delta}
      </span>
    );
  }

  if (delta < 0) {
    return (
      <span className="text-xs font-semibold text-danger">
        &#9660; {delta}
      </span>
    );
  }

  // delta === 0
  return <span className="text-xs text-dim">&mdash;</span>;
}
