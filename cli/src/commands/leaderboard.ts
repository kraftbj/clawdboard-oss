import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { loadConfig, getServerUrl } from "../config.js";
import { ApiClient } from "../api-client.js";

export const leaderboardCommand = new Command("leaderboard")
  .description("Show the top users on the leaderboard")
  .option("-n, --limit <number>", "Number of users to show", "10")
  .option("-p, --period <period>", "Time period: 7d, 30d, this-month, ytd", "7d")
  .action(async (opts: { limit: string; period: string }) => {
    const config = await loadConfig();
    const serverUrl = getServerUrl(config);
    const client = new ApiClient(serverUrl, config.apiToken);

    const spinner = ora("Fetching leaderboard…").start();

    try {
      const data = await client.getLeaderboard({
        limit: parseInt(opts.limit, 10) || 10,
        period: opts.period,
      });

      spinner.stop();

      console.log("");
      console.log(chalk.bold(`  clawdboard leaderboard (${data.period})`));
      console.log("");

      // Header
      console.log(
        chalk.gray(
          "  #   User                   Cost        Tokens       Days  Streak"
        )
      );
      console.log(chalk.gray("  " + "─".repeat(68)));

      for (const entry of data.entries) {
        const rank = String(entry.rank).padStart(2);
        const name = (entry.username ?? "anonymous").padEnd(20);
        const cost = `$${parseFloat(entry.totalCost).toFixed(2)}`.padStart(10);
        const tokens = formatTokens(entry.totalTokens).padStart(12);
        const days = String(entry.activeDays).padStart(5);
        const streak = String(entry.streak).padStart(6);

        console.log(`  ${chalk.cyan(rank)}  ${chalk.white(name)} ${chalk.yellow(cost)} ${tokens} ${days} ${streak}`);
      }

      console.log("");
    } catch (err) {
      spinner.fail("Failed to fetch leaderboard");
      if (err instanceof Error) {
        console.error(chalk.red(err.message));
      }
      process.exit(1);
    }
  });

function formatTokens(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
