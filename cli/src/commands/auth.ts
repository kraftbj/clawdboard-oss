import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import open from "open";
import { loadConfig, saveConfig, getServerUrl } from "../config.js";
import { ApiClient } from "../api-client.js";
import { runSync } from "./sync.js";
import { runSetupHook } from "./setup.js";

/**
 * Auth command -- Device flow authentication for clawdboard.
 *
 * Flow:
 * 1. Request a device code from the server
 * 2. Open verification_url (with code embedded) in browser
 * 3. Poll for authorization until approved, expired, or timed out
 * 4. Save API token to ~/.clawdboard/config.json
 * 5. Run first sync (extract + upload)
 * 6. Install auto-sync hook
 */
export const authCommand = new Command("auth")
  .description("Authenticate with clawdboard")
  .action(async () => {
    const config = await loadConfig();
    const serverUrl = getServerUrl(config);
    const client = new ApiClient(serverUrl);

    const spinner = ora();

    try {
      // Step 1: Request device code
      spinner.start("Requesting device code...");
      const deviceCode = await client.createDeviceCode();
      spinner.stop();

      // Step 2: Open browser (code is embedded in the URL)
      console.log();
      console.log(
        `Authorize in your browser: ${chalk.cyan(deviceCode.verification_url)}`
      );
      console.log(
        chalk.dim(`Code: ${deviceCode.user_code} (auto-filled in browser)`)
      );
      console.log();

      // Attempt to open browser (non-blocking, don't fail if it can't)
      try {
        await open(deviceCode.verification_url);
      } catch {
        // Browser open failed silently -- user can copy URL manually
      }

      // Step 3: Poll for authorization
      spinner.start("Waiting for authorization...");

      const startTime = Date.now();
      const timeoutMs = deviceCode.expires_in * 1000;
      const intervalMs = deviceCode.interval * 1000;

      let token: string | null = null;

      while (Date.now() - startTime < timeoutMs) {
        await sleep(intervalMs);

        const result = await client.pollDeviceToken(deviceCode.device_code);

        if (result !== null) {
          token = result.api_token;
          break;
        }
        // result === null means authorization_pending, keep polling
      }

      if (!token) {
        spinner.fail("Authorization timed out.");
        console.log(
          chalk.dim(
            "Run " +
              chalk.cyan("npx clawdboard auth") +
              " to start again."
          )
        );
        process.exit(1);
      }

      // Step 4: Save token to config
      spinner.stop();
      const newConfig = {
        ...config,
        apiToken: token,
        serverUrl: serverUrl,
      };
      await saveConfig(newConfig);

      console.log(
        chalk.green("Authenticated! Token saved to ~/.clawdboard/config.json")
      );

      // Step 5: Run first sync
      console.log();
      try {
        await runSync(newConfig, {}, spinner);
      } catch {
        // Sync failure after auth is non-fatal -- auth itself succeeded
        console.log(
          chalk.dim(
            "Sync failed, but authentication was successful. You can run `clawdboard sync` later."
          )
        );
      }

      // Step 6: Install auto-sync hook (no prompt — user already opted in by authenticating)
      console.log();
      await runSetupHook();

      // Step 7: Link to leaderboard
      console.log();
      console.log(
        `See your ranking: ${chalk.cyan(serverUrl)}`
      );
    } catch (err) {
      spinner.stop();

      if (err instanceof Error) {
        console.error(chalk.red(`Authentication failed: ${err.message}`));
      } else {
        console.error(chalk.red("Authentication failed unexpectedly."));
      }
      process.exit(1);
    }
  });

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
