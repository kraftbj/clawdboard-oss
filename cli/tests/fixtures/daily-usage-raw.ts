/**
 * Test fixtures mimicking ccusage DailyUsage output WITH private fields.
 * These simulate what ccusage's loadDailyUsageData() returns, including
 * fields that MUST be stripped before any data leaves the user's machine.
 */

export const RAW_DAILY_WITH_PRIVATE_FIELDS = [
  {
    date: "2026-02-20",
    project: "/Users/jim/work/secret-client",
    projectPath: "/Users/jim/work/secret-client",
    sessionId: "sess_abc123def456",
    gitBranch: "feature/confidential-feature",
    inputTokens: 15000,
    outputTokens: 8000,
    cacheCreationTokens: 2000,
    cacheReadTokens: 5000,
    totalCost: 0.45,
    modelsUsed: ["claude-sonnet-4-20250514"],
    modelBreakdowns: [
      {
        modelName: "claude-sonnet-4-20250514",
        inputTokens: 15000,
        outputTokens: 8000,
        cacheCreationTokens: 2000,
        cacheReadTokens: 5000,
        cost: 0.45,
        sessionId: "sess_abc123def456",
        projectPath: "/Users/jim/work/secret-client",
      },
    ],
  },
];

export const RAW_DAILY_MULTIPLE_DAYS = [
  {
    date: "2026-02-18",
    project: "/home/user/code/internal-tool",
    projectPath: "/home/user/code/internal-tool",
    sessionId: "sess_xyz789",
    gitBranch: "main",
    inputTokens: 10000,
    outputTokens: 5000,
    cacheCreationTokens: 1000,
    cacheReadTokens: 3000,
    totalCost: 0.30,
    modelsUsed: ["claude-sonnet-4-20250514", "claude-haiku-3-20250514"],
    modelBreakdowns: [
      {
        modelName: "claude-sonnet-4-20250514",
        inputTokens: 7000,
        outputTokens: 3000,
        cacheCreationTokens: 700,
        cacheReadTokens: 2000,
        cost: 0.20,
        sessionId: "sess_xyz789",
        projectPath: "/home/user/code/internal-tool",
      },
      {
        modelName: "claude-haiku-3-20250514",
        inputTokens: 3000,
        outputTokens: 2000,
        cacheCreationTokens: 300,
        cacheReadTokens: 1000,
        cost: 0.10,
        sessionId: "sess_xyz789",
        projectPath: "/home/user/code/internal-tool",
      },
    ],
  },
  {
    date: "2026-02-19",
    project: "C:\\Users\\dev\\projects\\windows-app",
    projectPath: "C:\\Users\\dev\\projects\\windows-app",
    sessionId: "sess_win456",
    gitBranch: "feature/auth",
    inputTokens: 20000,
    outputTokens: 12000,
    cacheCreationTokens: 3000,
    cacheReadTokens: 7000,
    totalCost: 0.65,
    modelsUsed: ["claude-sonnet-4-20250514"],
    modelBreakdowns: [
      {
        modelName: "claude-sonnet-4-20250514",
        inputTokens: 20000,
        outputTokens: 12000,
        cacheCreationTokens: 3000,
        cacheReadTokens: 7000,
        cost: 0.65,
        sessionId: "sess_win456",
        projectPath: "C:\\Users\\dev\\projects\\windows-app",
      },
    ],
  },
];

export const RAW_DAILY_EMPTY: unknown[] = [];
