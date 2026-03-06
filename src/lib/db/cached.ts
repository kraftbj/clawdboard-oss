import { unstable_cache } from "next/cache";
import {
  getLeaderboardData as _getLeaderboardData,
  getUserLeaderboardRow as _getUserLeaderboardRow,
  getVibeCoderCount as _getVibeCoderCount,
} from "./leaderboard";
import {
  getUserSummary as _getUserSummary,
  getUserDailyData as _getUserDailyData,
  getUserModelBreakdown as _getUserModelBreakdown,
  getUserRank as _getUserRank,
} from "./profile";
import {
  getPublicTeamLeaderboard as _getPublicTeamLeaderboard,
  getTeamLeaderboardData as _getTeamLeaderboardData,
  getTeamStats as _getTeamStats,
} from "./teams";

// Re-export types and constants so pages only need one import source
export type { Period, SortCol, SortOrder, LeaderboardRow, LeaderboardResult, DateRange } from "./leaderboard";
export { VALID_PERIODS, VALID_SORTS, VALID_ORDERS, parseDateRange } from "./leaderboard";
export { MIN_DATE } from "@/lib/constants";

// ─── High priority (expensive, called on every navigation) ──────────────────

export const getLeaderboardData = unstable_cache(
  _getLeaderboardData,
  ["leaderboard"],
  { revalidate: 120 }
);

export const getUserLeaderboardRow = unstable_cache(
  _getUserLeaderboardRow,
  ["user-leaderboard-row"],
  { revalidate: 120 }
);

export const getPublicTeamLeaderboard = unstable_cache(
  _getPublicTeamLeaderboard,
  ["team-leaderboard"],
  { revalidate: 120 }
);

export const getUserRank = unstable_cache(
  _getUserRank,
  ["user-rank"],
  { revalidate: 300 }
);

export const getVibeCoderCount = unstable_cache(
  _getVibeCoderCount,
  ["vibe-coder-count"],
  { revalidate: 300 }
);

// ─── Medium priority (user/team-scoped aggregations) ────────────────────────

export const getTeamLeaderboardData = unstable_cache(
  _getTeamLeaderboardData,
  ["team-members-lb"],
  { revalidate: 120 }
);

export const getTeamStats = unstable_cache(
  _getTeamStats,
  ["team-stats"],
  { revalidate: 300 }
);

// NOTE: getTeamMembers is NOT cached — it returns Date objects (joinedAt, leftAt)
// that would be silently stringified by unstable_cache's JSON serialization,
// breaking Intl.DateTimeFormat.format() in MemberList. It's a simple indexed
// join so the caching benefit is marginal anyway.

export const getUserSummary = unstable_cache(
  _getUserSummary,
  ["user-summary"],
  { revalidate: 120 }
);

export const getUserDailyData = unstable_cache(
  _getUserDailyData,
  ["user-daily"],
  { revalidate: 120 }
);

export const getUserModelBreakdown = unstable_cache(
  _getUserModelBreakdown,
  ["user-models"],
  { revalidate: 120 }
);
