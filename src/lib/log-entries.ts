export interface LogItem {
  title: string;
  type: "feature" | "fix" | "improvement";
  description: string;
  image?: string; // path relative to /public, e.g. "/log/recap-stories.png"
}

export interface LogEntry {
  date: string; // YYYY-MM-DD
  items: LogItem[];
}

export const logEntries: LogEntry[] = [
  {
    date: "2026-03-14",
    items: [
      {
        title: "Multi-tool support: OpenCode & Codex CLI",
        type: "feature",
        description:
          "clawdboard now tracks usage from OpenCode and Codex CLI alongside Claude Code. Your profile and leaderboard stats automatically break down usage by tool.",
      },
      {
        title: "Weekly & monthly recap stories",
        type: "feature",
        description:
          "Your profile now shows weekly and monthly recap cards with generative visuals — a quick snapshot of your usage patterns, top models, and activity streaks.",
        image: "/log/recap-stories.png",
      },
      {
        title: "Changelog page",
        type: "feature",
        description:
          "You're looking at it. clawdboard now has a changelog so you can keep up with new features and fixes.",
      },
    ],
  },
  {
    date: "2025-03-12",
    items: [
      {
        title: "Better badge wizard experience",
        type: "improvement",
        description:
          "Improved the badge setup wizard for users who don't have a GitHub profile README yet. The wizard now detects this and guides you through creating one before adding your clawdboard badge.",
      },
    ],
  },
  {
    date: "2025-03-11",
    items: [
      {
        title: "Smarter sync hook",
        type: "fix",
        description:
          "Moved the auto-sync hook from PostToolUse to Stop with shell-level debounce. This prevents redundant syncs during rapid tool calls and reduces unnecessary API traffic.",
      },
      {
        title: "Team stats refresh on membership changes",
        type: "fix",
        description:
          "Team stats cache now invalidates when members join or leave. Previously, the leaderboard could show stale team totals until the next hourly refresh.",
      },
    ],
  },
  {
    date: "2025-03-10",
    items: [
      {
        title: "Teams are public by default",
        type: "improvement",
        description:
          "New teams are now public by default so they show up on the teams leaderboard immediately. You can still make your team private in team settings.",
      },
    ],
  },
  {
    date: "2025-03-09",
    items: [
      {
        title: "Team invites and notifications",
        type: "feature",
        description:
          "You can now invite people to your team directly from clawdboard. Invitees get a notification with a one-click join link. Team owners can manage pending invites from team settings.",
      },
    ],
  },
  {
    date: "2025-03-08",
    items: [
      {
        title: "Improved charts for single-day views",
        type: "improvement",
        description:
          "Single-day chart selections now show a proper bar chart instead of a confusing single-point line. Empty states and hover cursors were also cleaned up.",
      },
    ],
  },
  {
    date: "2025-03-07",
    items: [
      {
        title: "All signed-up users visible on leaderboard",
        type: "fix",
        description:
          "Users who signed up but haven't synced yet now appear on the leaderboard with zero stats instead of being invisible. This makes it easier to find and invite teammates.",
      },
      {
        title: "Cache tokens counted in totals",
        type: "fix",
        description:
          "Cache read and creation tokens are now included in total token counts across the leaderboard and team views. Previously only input and output tokens were summed.",
      },
    ],
  },
  {
    date: "2025-03-05",
    items: [
      {
        title: "Custom date range picker",
        type: "feature",
        description:
          "Added a custom date range picker to the time filter. Select any start and end date to see usage stats for exactly the period you care about.",
      },
    ],
  },
  {
    date: "2025-03-03",
    items: [
      {
        title: "Internationalization support",
        type: "feature",
        description:
          "clawdboard is now available in English, French, German, and Spanish. The site auto-detects your browser language and you can switch manually from the header.",
      },
    ],
  },
];
