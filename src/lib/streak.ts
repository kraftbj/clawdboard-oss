/**
 * Compute the current streak from a sorted array of daily data rows.
 * A streak is the count of consecutive days ending at today or yesterday.
 */
export function computeCurrentStreak(
  dailyRows: { date: string | null }[]
): number {
  if (dailyRows.length === 0) return 0;

  // Get today's date in YYYY-MM-DD format (UTC)
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  // Build a Set of active dates for O(1) lookup
  const activeDates = new Set(
    dailyRows.map((r) => r.date).filter(Boolean) as string[]
  );

  // Start counting from today, then go backwards
  let streak = 0;
  const d = new Date(todayStr + "T00:00:00Z");

  // Allow the streak to start from today or yesterday
  if (!activeDates.has(d.toISOString().slice(0, 10))) {
    d.setUTCDate(d.getUTCDate() - 1);
    if (!activeDates.has(d.toISOString().slice(0, 10))) {
      return 0;
    }
  }

  while (activeDates.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setUTCDate(d.getUTCDate() - 1);
  }

  return streak;
}
