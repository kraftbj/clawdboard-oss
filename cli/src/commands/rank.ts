import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { loadConfig, getServerUrl } from "../config.js";
import { ApiClient } from "../api-client.js";

export const rankCommand = new Command("rank")
  .description("Show your current rank on the leaderboard")
  .action(async () => {
    const config = await loadConfig();

    if (!config.apiToken) {
      console.error(
        chalk.red("Not authenticated. Run `clawdboard auth` first.")
      );
      process.exit(1);
    }

    const spinner = ora("Fetching your rank…").start();

    try {
      const serverUrl = getServerUrl(config);
      const client = new ApiClient(serverUrl, config.apiToken);
      const data = await client.getRank();

      spinner.stop();

      console.log("");
      console.log(chalk.bold("  Your clawdboard rank"));
      console.log("");
      console.log(`  Rank:        ${chalk.cyan.bold(`#${data.rank}`)} of ${data.totalUsers}`);
      console.log(`  Percentile:  ${chalk.green.bold(`top ${(100 - data.percentile).toFixed(1)}%`)}`);
      console.log(`  Total cost:  ${chalk.yellow.bold(`$${data.totalCost}`)}`);
      console.log("");
    } catch (err) {
      spinner.fail("Failed to fetch rank");
      if (err instanceof Error) {
        console.error(chalk.red(err.message));
      }
      process.exit(1);
    }
  });
