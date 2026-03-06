/** Earliest date accepted for custom date range queries */
export const MIN_DATE = "2024-01-01";

/** Valid time period filter values (client-safe, no server imports) */
export const VALID_PERIODS = [
  "today",
  "7d",
  "30d",
  "this-month",
  "ytd",
  "custom",
] as const;

export type Period = (typeof VALID_PERIODS)[number];
