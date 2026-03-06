import { readFile, writeFile, mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

/**
 * A single hook entry within a hook group.
 */
export interface HookEntry {
  type: string;
  command: string;
  async?: boolean;
  timeout?: number;
}

/**
 * A hook group, optionally scoped to specific tools via matcher.
 */
export interface HookGroup {
  matcher?: string;
  hooks: HookEntry[];
}

/**
 * Claude Code settings.json structure.
 * Uses index signature to preserve all unknown keys (permissions, statusLine, etc.)
 */
export interface ClaudeSettings {
  hooks?: Record<string, HookGroup[]>;
  [key: string]: unknown;
}

const CLAUDE_DIR = join(homedir(), ".claude");
const SETTINGS_PATH = join(CLAUDE_DIR, "settings.json");

/**
 * Read and parse ~/.claude/settings.json.
 * Returns {} if file doesn't exist, is empty, or has invalid JSON.
 */
export async function readSettings(): Promise<ClaudeSettings> {
  try {
    const raw = await readFile(SETTINGS_PATH, "utf-8");
    const trimmed = raw.trim();
    if (!trimmed) return {};
    return JSON.parse(trimmed) as ClaudeSettings;
  } catch {
    return {};
  }
}

/**
 * Write settings to ~/.claude/settings.json.
 * Creates the ~/.claude/ directory if it doesn't exist.
 */
export async function writeSettings(settings: ClaudeSettings): Promise<void> {
  await mkdir(CLAUDE_DIR, { recursive: true });
  await writeFile(
    SETTINGS_PATH,
    JSON.stringify(settings, null, 2) + "\n",
    "utf-8"
  );
}

/**
 * Check if the current clawdboard hook is already installed in PostToolUse.
 */
function hasNewHook(settings: ClaudeSettings): boolean {
  const postToolUse = settings.hooks?.PostToolUse ?? [];
  return postToolUse.some((group) =>
    group.hooks.some((h) => h.command.includes("clawdboard"))
  );
}

/**
 * Check if the legacy ccboard hook is present in PostToolUse.
 */
function hasLegacyHook(settings: ClaudeSettings): boolean {
  const postToolUse = settings.hooks?.PostToolUse ?? [];
  return postToolUse.some((group) =>
    group.hooks.some((h) => h.command.includes("ccboard"))
  );
}

/**
 * Check if any clawdboard or legacy ccboard hook is installed.
 */
export function isHookInstalled(settings: ClaudeSettings): boolean {
  return hasNewHook(settings) || hasLegacyHook(settings);
}

/**
 * Remove all hook groups that contain a legacy ccboard hook command.
 */
function removeLegacyHooks(postToolUse: HookGroup[]): HookGroup[] {
  return postToolUse.filter(
    (group) => !group.hooks.some((h) => h.command.includes("ccboard"))
  );
}

/**
 * Pure function: install or migrate the clawdboard PostToolUse hook.
 *
 * - If the new hook already exists → alreadyInstalled: true
 * - If the legacy ccboard hook exists → replace it with the new one (migrated: true)
 * - If neither exists → install fresh
 *
 * Preserves ALL existing keys (permissions, statusLine, etc.)
 */
export function installHook(settings: ClaudeSettings): {
  settings: ClaudeSettings;
  alreadyInstalled: boolean;
  migrated: boolean;
} {
  if (hasNewHook(settings)) {
    return { settings, alreadyInstalled: true, migrated: false };
  }

  const existing = settings.hooks?.PostToolUse ?? [];
  const migrated = hasLegacyHook(settings);

  // Remove legacy ccboard hooks before adding the new one
  const cleaned = migrated ? removeLegacyHooks(existing) : existing;

  const hookEntry: HookGroup = {
    hooks: [
      {
        type: "command",
        command: "npx clawdboard hook-sync",
        async: true,
        timeout: 120,
      },
    ],
  };

  const merged: ClaudeSettings = {
    ...settings,
    hooks: {
      ...settings.hooks,
      PostToolUse: [...cleaned, hookEntry],
    },
  };

  return { settings: merged, alreadyInstalled: false, migrated };
}
