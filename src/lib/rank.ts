export const rankColors: Record<number, string> = {
  1: "text-amber-400",
  2: "text-zinc-400",
  3: "text-amber-600",
};

export const rankIcons: Record<number, string> = {
  1: "\u25C6", // diamond
  2: "\u25B2", // triangle
  3: "\u25CF", // circle
};

export function rankBorderClass(rank: number): string {
  switch (rank) {
    case 1: return "border-l-2 border-l-amber-400";
    case 2: return "border-l-2 border-l-zinc-500";
    case 3: return "border-l-2 border-l-amber-700";
    default: return "";
  }
}
