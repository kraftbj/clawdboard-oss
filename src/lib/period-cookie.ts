import { VALID_PERIODS, type Period } from "@/lib/constants";

export const PERIOD_COOKIE = "clawdboard-period";

/** Encode period (and optional custom range) into a cookie value string. */
export function serializePeriodCookie(
  period: string,
  from?: string,
  to?: string
): string {
  if (period === "custom" && from && to) return `custom:${from}:${to}`;
  return period;
}

/** Decode a cookie value into period + optional range. Returns null for invalid values. */
export function parsePeriodCookie(
  value: string | undefined
): { period: Period; from?: string; to?: string } | null {
  if (!value) return null;
  const parts = value.split(":");
  const period = parts[0];
  if (!VALID_PERIODS.includes(period as Period)) return null;
  if (period === "custom" && parts.length === 3) {
    return { period: "custom", from: parts[1], to: parts[2] };
  }
  return { period: period as Period };
}
