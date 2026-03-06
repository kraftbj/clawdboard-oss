"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  eachDayOfInterval,
  format,
  subDays,
  parseISO,
  startOfMonth,
  startOfYear,
} from "date-fns";
import { useTranslations } from "next-intl";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import type { Period, DateRange } from "@/lib/db/leaderboard";

interface UsageDataPoint {
  date: string;
  cost: number;
  tokens: number;
}

type Metric = "cost" | "tokens" | "both";

interface UsageChartProps {
  data: UsageDataPoint[];
  period: Period;
  range?: DateRange;
}

/**
 * Compute the start date for gap-filling based on the active period.
 */
function getPeriodStartDate(period: Period, range?: DateRange): Date {
  const today = new Date();
  switch (period) {
    case "today":
      return today;
    case "7d":
      return subDays(today, 6);
    case "30d":
      return subDays(today, 29);
    case "this-month":
      return startOfMonth(today);
    case "ytd":
      return startOfYear(today);
    case "custom":
      if (range) return parseISO(range.from);
      return subDays(today, 29);
  }
}

function getPeriodEndDate(period: Period, range?: DateRange): Date {
  if (period === "custom" && range) return parseISO(range.to);
  return new Date();
}

/**
 * Fill gaps in daily data so every day in the period has a value.
 */
function fillDateGaps(
  rawData: UsageDataPoint[],
  period: Period,
  range?: DateRange
): UsageDataPoint[] {
  const startDate = getPeriodStartDate(period, range);
  const endDate = getPeriodEndDate(period, range);

  const allDates = eachDayOfInterval({ start: startDate, end: endDate });

  const dataMap = new Map<string, UsageDataPoint>();
  for (const point of rawData) {
    dataMap.set(point.date, point);
  }

  return allDates.map((d) => {
    const dateStr = format(d, "yyyy-MM-dd");
    const existing = dataMap.get(dateStr);
    return existing ?? { date: dateStr, cost: 0, tokens: 0 };
  });
}

function getPeriodTitle(period: Period, range: DateRange | undefined, t: (key: string, values?: Record<string, string>) => string): string {
  switch (period) {
    case "today":
      return t("usageToday");
    case "7d":
      return t("usage7d");
    case "30d":
      return t("usage30d");
    case "this-month":
      return t("usageThisMonth");
    case "ytd":
      return t("usageYtd");
    case "custom":
      if (range) {
        const fmt = (d: string) =>
          new Date(d + "T00:00:00").toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        return t("usageCustom", { range: `${fmt(range.from)} \u2013 ${fmt(range.to)}` });
      }
      return t("usage");
  }
}

function formatXAxisDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "MMM d");
  } catch {
    return dateStr;
  }
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

function formatTokensCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function UsageChart({ data, period, range }: UsageChartProps) {
  const t = useTranslations("profile");
  const [metric, setMetric] = useState<Metric>("cost");
  const filledData = useMemo(
    () => fillDateGaps(data, period, range),
    [data, period, range]
  );

  const METRICS: { value: Metric; label: string }[] = [
    { value: "cost", label: t("costMetric") },
    { value: "tokens", label: t("tokensMetric") },
    { value: "both", label: t("bothMetric") },
  ];

  const title = getPeriodTitle(period, range, t);
  const showCost = metric === "cost" || metric === "both";
  const showTokens = metric === "tokens" || metric === "both";
  const isDual = metric === "both";

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          {title}
          <InfoTooltip text="Estimated daily Claude Code usage based on API token consumption and model pricing." />
        </h3>
        <div className="flex items-center rounded-lg border border-border bg-surface overflow-hidden">
          {METRICS.map((m) => (
            <button
              key={m.value}
              onClick={() => setMetric(m.value)}
              className={`px-3 py-1.5 font-mono text-xs font-medium transition-colors whitespace-nowrap ${
                metric === m.value
                  ? "bg-accent text-background"
                  : "text-foreground/60 hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={filledData}
          margin={{ top: 4, right: isDual ? 4 : 4, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F9A615" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#F9A615" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="tokensGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border-color)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxisDate}
            stroke="var(--muted)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={40}
          />

          {/* Cost Y-axis (left) */}
          {showCost && (
            <YAxis
              yAxisId="left"
              tickFormatter={formatCurrency}
              stroke="var(--muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={60}
            />
          )}

          {/* Tokens Y-axis (right, only in dual mode) */}
          {showTokens && (
            <YAxis
              yAxisId={isDual ? "right" : "left"}
              orientation={isDual ? "right" : "left"}
              tickFormatter={formatTokensCompact}
              stroke="var(--muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={60}
            />
          )}

          <Tooltip
            contentStyle={{
              backgroundColor: "#111113",
              border: "1px solid #23232a",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#fafafa",
            }}
            itemStyle={{ color: "#fafafa" }}
            labelStyle={{ color: "#a1a1aa" }}
            formatter={(value: number | undefined, name: string | undefined) => {
              const v = value ?? 0;
              if (name === "cost") return [formatCurrency(v), "Cost"];
              if (name === "tokens")
                return [formatTokensCompact(v), "Tokens"];
              return [String(v), name ?? ""];
            }}
            labelFormatter={(label: unknown) =>
              formatXAxisDate(String(label ?? ""))
            }
          />

          {showCost && (
            <Area
              type="monotone"
              dataKey="cost"
              yAxisId="left"
              stroke="#F9A615"
              strokeWidth={2}
              fill="url(#costGradient)"
            />
          )}

          {showTokens && (
            <Area
              type="monotone"
              dataKey="tokens"
              yAxisId={isDual ? "right" : "left"}
              stroke="#06b6d4"
              strokeWidth={2}
              fill="url(#tokensGradient)"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
