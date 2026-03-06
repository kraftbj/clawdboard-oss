import { describe, it, expect } from "vitest";
import { sanitizeDailyData } from "../src/extract.js";
import { SyncPayloadSchema } from "../src/schemas.js";
import {
  RAW_DAILY_WITH_PRIVATE_FIELDS,
  RAW_DAILY_MULTIPLE_DAYS,
  RAW_DAILY_EMPTY,
} from "./fixtures/daily-usage-raw.js";

describe("sanitizeDailyData", () => {
  describe("privacy enforcement", () => {
    it("strips project paths from output", () => {
      const result = sanitizeDailyData(RAW_DAILY_WITH_PRIVATE_FIELDS);
      const day = result.days[0];

      // The 'project' field must not exist in the output
      expect(day).not.toHaveProperty("project");
      expect(day).not.toHaveProperty("projectPath");
    });

    it("strips session IDs from output", () => {
      const result = sanitizeDailyData(RAW_DAILY_WITH_PRIVATE_FIELDS);
      const day = result.days[0];

      expect(day).not.toHaveProperty("sessionId");

      // Model breakdowns must also have no sessionId
      for (const mb of day.modelBreakdowns) {
        expect(mb).not.toHaveProperty("sessionId");
      }
    });

    it("strips git branches from output", () => {
      const result = sanitizeDailyData(RAW_DAILY_WITH_PRIVATE_FIELDS);
      const day = result.days[0];

      expect(day).not.toHaveProperty("gitBranch");
    });

    it("output JSON contains no path-like strings", () => {
      const result = sanitizeDailyData(RAW_DAILY_WITH_PRIVATE_FIELDS);
      const json = JSON.stringify(result);

      // No Unix paths
      expect(json).not.toContain("/Users/");
      expect(json).not.toContain("/home/");

      // No Windows paths
      expect(json).not.toContain("C:\\");

      // No session ID patterns
      expect(json).not.toContain("sess_");
      expect(json).not.toContain("abc123def456");

      // No git branch names from the fixture
      expect(json).not.toContain("feature/confidential-feature");
    });

    it("output JSON with multiple days contains no path-like strings", () => {
      const result = sanitizeDailyData(RAW_DAILY_MULTIPLE_DAYS);
      const json = JSON.stringify(result);

      expect(json).not.toContain("/home/user/code");
      expect(json).not.toContain("C:\\Users\\dev");
      expect(json).not.toContain("sess_xyz789");
      expect(json).not.toContain("sess_win456");
      expect(json).not.toContain("feature/auth");
      expect(json).not.toContain("internal-tool");
      expect(json).not.toContain("windows-app");
    });

    it("modelBreakdowns contain only allowlisted sub-fields", () => {
      const result = sanitizeDailyData(RAW_DAILY_WITH_PRIVATE_FIELDS);
      const mb = result.days[0].modelBreakdowns[0];

      const allowedKeys = [
        "modelName",
        "inputTokens",
        "outputTokens",
        "cacheCreationTokens",
        "cacheReadTokens",
        "cost",
      ];
      expect(Object.keys(mb).sort()).toEqual(allowedKeys.sort());
    });
  });

  describe("data preservation", () => {
    it("preserves all allowlisted aggregate fields", () => {
      const result = sanitizeDailyData(RAW_DAILY_WITH_PRIVATE_FIELDS);
      const day = result.days[0];

      expect(day.date).toBe("2026-02-20");
      expect(day.inputTokens).toBe(15000);
      expect(day.outputTokens).toBe(8000);
      expect(day.cacheCreationTokens).toBe(2000);
      expect(day.cacheReadTokens).toBe(5000);
      expect(day.totalCost).toBe(0.45);
      expect(day.modelsUsed).toEqual(["claude-sonnet-4-20250514"]);
    });

    it("preserves modelBreakdown aggregate data", () => {
      const result = sanitizeDailyData(RAW_DAILY_WITH_PRIVATE_FIELDS);
      const mb = result.days[0].modelBreakdowns[0];

      expect(mb.modelName).toBe("claude-sonnet-4-20250514");
      expect(mb.inputTokens).toBe(15000);
      expect(mb.outputTokens).toBe(8000);
      expect(mb.cacheCreationTokens).toBe(2000);
      expect(mb.cacheReadTokens).toBe(5000);
      expect(mb.cost).toBe(0.45);
    });

    it("preserves multiple days with multiple model breakdowns", () => {
      const result = sanitizeDailyData(RAW_DAILY_MULTIPLE_DAYS);

      expect(result.days).toHaveLength(2);
      expect(result.days[0].date).toBe("2026-02-18");
      expect(result.days[1].date).toBe("2026-02-19");
      expect(result.days[0].modelBreakdowns).toHaveLength(2);
      expect(result.days[1].modelBreakdowns).toHaveLength(1);
    });
  });

  describe("schema validation", () => {
    it("rejects payload with more than 365 days", () => {
      // Create an array of 366 day entries
      const tooManyDays = Array.from({ length: 366 }, (_, i) => ({
        date: `2026-01-01`,
        inputTokens: 100,
        outputTokens: 50,
        cacheCreationTokens: 10,
        cacheReadTokens: 20,
        totalCost: 0.01,
        modelsUsed: ["claude-sonnet-4-20250514"],
        modelBreakdowns: [
          {
            modelName: "claude-sonnet-4-20250514",
            inputTokens: 100,
            outputTokens: 50,
            cacheCreationTokens: 10,
            cacheReadTokens: 20,
            cost: 0.01,
          },
        ],
      }));

      expect(() => sanitizeDailyData(tooManyDays)).toThrow();
    });

    it("handles empty days array", () => {
      const result = sanitizeDailyData(RAW_DAILY_EMPTY);

      expect(result.days).toEqual([]);
    });

    it("output passes Zod SyncPayloadSchema validation", () => {
      const result = sanitizeDailyData(RAW_DAILY_WITH_PRIVATE_FIELDS);

      // This should not throw -- output must be schema-valid
      const parsed = SyncPayloadSchema.parse(result);
      expect(parsed).toEqual(result);
    });
  });
});
