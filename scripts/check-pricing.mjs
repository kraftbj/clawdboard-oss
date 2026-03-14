#!/usr/bin/env node

/**
 * Weekly pricing drift checker.
 *
 * Fetches pricing pages from Anthropic, OpenAI, and Google, extracts
 * model prices, and compares them against cli/src/pricing.ts.
 * If differences are found, updates the file in-place so the GitHub
 * Action can commit and open a PR.
 *
 * Extraction strategies:
 *   - Anthropic: docs page at platform.claude.com is server-rendered,
 *     so plain fetch + regex works.
 *   - OpenAI & Google: client-rendered SPAs. Uses Playwright (headless
 *     Chromium) to render the page, then extracts from the DOM.
 *     Falls back gracefully if Playwright is not installed.
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRICING_FILE = resolve(__dirname, "../cli/src/pricing.ts");

// ---------------------------------------------------------------------------
// Parse current pricing table from TypeScript source
// ---------------------------------------------------------------------------

function parsePricingTable(source) {
  const entries = {};
  const re =
    /"([^"]+)":\s*\{\s*input:\s*([\d.]+),\s*output:\s*([\d.]+),\s*cacheWrite:\s*([\d.]+),\s*cacheRead:\s*([\d.]+)\s*\}/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    entries[m[1]] = {
      input: parseFloat(m[2]),
      output: parseFloat(m[3]),
      cacheWrite: parseFloat(m[4]),
      cacheRead: parseFloat(m[5]),
    };
  }
  return entries;
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; clawdboard-pricing-checker/1.0)",
        Accept: "text/html,application/xhtml+xml,*/*",
      },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Render a page with Playwright and return the full rendered HTML.
 * Returns null if Playwright is not installed.
 */
async function fetchRenderedHtml(url) {
  let playwright;
  try {
    playwright = await import("playwright");
  } catch {
    return null; // Playwright not installed
  }

  const browser = await playwright.chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
    // Wait a bit extra for any lazy-rendered pricing tables
    await page.waitForTimeout(2_000);
    return await page.content();
  } finally {
    await browser.close();
  }
}

// ---------------------------------------------------------------------------
// Provider: Anthropic (server-rendered — plain fetch)
// ---------------------------------------------------------------------------

/**
 * Ordered most-specific first to avoid substring collisions.
 * "Claude Opus 4.6" must be checked before "Claude Opus 4".
 */
const ANTHROPIC_MODELS = [
  { docName: "Claude Opus 4.6", key: "claude-opus-4-6" },
  { docName: "Claude Opus 4.5", key: "claude-opus-4-5" },
  { docName: "Claude Opus 4.1", key: "claude-opus-4-1" },
  { docName: "Claude Opus 4", key: "claude-opus-4" },
  { docName: "Claude Sonnet 4.6", key: "claude-sonnet-4-6" },
  { docName: "Claude Sonnet 4.5", key: "claude-sonnet-4-5" },
  { docName: "Claude Sonnet 4", key: "claude-sonnet-4" },
  { docName: "Claude Haiku 4.5", key: "claude-haiku-4-5" },
  { docName: "Claude Haiku 3.5", key: "claude-3-5-haiku" },
  { docName: "Claude Opus 3", key: "claude-3-opus" },
  { docName: "Claude Haiku 3", key: "claude-3-haiku" },
];

async function fetchAnthropicPricing() {
  const prices = {};

  const urls = [
    "https://platform.claude.com/docs/en/about-claude/pricing",
    "https://docs.anthropic.com/en/docs/about-claude/pricing",
  ];

  for (const url of urls) {
    try {
      const html = await fetchText(url);

      // Process models most-specific first. After matching, remove the
      // matched region so "Claude Opus 4" can't accidentally match
      // inside the "Claude Opus 4.6" row.
      let remaining = html;

      for (const { docName, key } of ANTHROPIC_MODELS) {
        const escaped = docName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        // The pricing table has columns:
        // Model | Base Input | 5m Cache Write | 1h Cache Write | Cache Hits | Output
        const rowRe = new RegExp(
          escaped +
            "(?=[^\\w.])" + // word boundary: not followed by word char or dot
            "[^$]*?" +
            "\\$(\\d+(?:\\.\\d+)?)" + // base input
            "[^$]*?" +
            "\\$(\\d+(?:\\.\\d+)?)" + // 5m cache write
            "[^$]*?" +
            "\\$(\\d+(?:\\.\\d+)?)" + // 1h cache write (skip)
            "[^$]*?" +
            "\\$(\\d+(?:\\.\\d+)?)" + // cache hits/read
            "[^$]*?" +
            "\\$(\\d+(?:\\.\\d+)?)", // output
          "s"
        );

        const match = remaining.match(rowRe);
        if (match) {
          prices[key] = {
            input: parseFloat(match[1]),
            output: parseFloat(match[5]),
            cacheWrite: parseFloat(match[2]),
            cacheRead: parseFloat(match[4]),
          };
          remaining =
            remaining.slice(0, match.index) +
            remaining.slice(match.index + match[0].length);
        }
      }

      if (Object.keys(prices).length > 0) break;
    } catch (err) {
      console.warn(`  [anthropic] Failed to fetch ${url}: ${err.message}`);
    }
  }

  return prices;
}

// ---------------------------------------------------------------------------
// Provider: OpenAI (client-rendered — needs Playwright)
// ---------------------------------------------------------------------------

const OPENAI_MODELS = [
  { key: "gpt-4o-mini", names: ["gpt-4o-mini", "GPT-4o mini"] },
  { key: "gpt-4o", names: ["gpt-4o", "GPT-4o"] },
  { key: "o1-mini", names: ["o1-mini"] },
  { key: "o1", names: ["o1"] },
  { key: "o3-mini", names: ["o3-mini"] },
  { key: "o3", names: ["o3"] },
  { key: "o4-mini", names: ["o4-mini"] },
];

async function fetchOpenAIPricing() {
  const prices = {};

  const html = await fetchRenderedHtml(
    "https://platform.openai.com/docs/pricing"
  );
  if (!html) return prices; // Playwright not available

  // Process most-specific first (e.g., "gpt-4o-mini" before "gpt-4o")
  let remaining = html;

  for (const { key, names } of OPENAI_MODELS) {
    for (const name of names) {
      const idx = remaining.indexOf(name);
      if (idx === -1) continue;

      // Grab a window after the model name
      const window = remaining.slice(idx, idx + 600);

      // Look for price patterns like "$2.50 / 1M" or "$2.50/M"
      const pricePattern = /\$(\d+(?:\.\d+)?)\s*(?:\/\s*(?:1M|M))?/g;
      const priceMatches = [...window.matchAll(pricePattern)]
        .map((m) => parseFloat(m[1]))
        .filter((p) => p > 0);

      if (priceMatches.length >= 2) {
        prices[key] = {
          input: priceMatches[0],
          output: priceMatches[1],
          cacheWrite: 0,
          cacheRead: priceMatches.length >= 3 ? priceMatches[2] : 0,
        };
        // Remove matched region
        remaining =
          remaining.slice(0, idx) + remaining.slice(idx + 600);
        break;
      }
    }
  }

  return prices;
}

// ---------------------------------------------------------------------------
// Provider: Google (client-rendered — needs Playwright)
// ---------------------------------------------------------------------------

const GOOGLE_MODELS = [
  { key: "gemini-2.5-pro", names: ["Gemini 2.5 Pro"] },
  { key: "gemini-2.5-flash", names: ["Gemini 2.5 Flash"] },
  { key: "gemini-2.0-flash", names: ["Gemini 2.0 Flash"] },
];

async function fetchGooglePricing() {
  const prices = {};

  const html = await fetchRenderedHtml(
    "https://ai.google.dev/gemini-api/docs/pricing"
  );
  if (!html) return prices; // Playwright not available

  for (const { key, names } of GOOGLE_MODELS) {
    for (const name of names) {
      // Find the model name in the rendered HTML
      const idx = html.indexOf(name);
      if (idx === -1) continue;

      // Look in a window for price patterns
      const window = html.slice(idx, idx + 1500);
      const priceMatches = [...window.matchAll(/\$(\d+(?:\.\d+)?)/g)]
        .map((m) => parseFloat(m[1]))
        .filter((p) => p > 0);

      if (priceMatches.length >= 2) {
        prices[key] = {
          input: priceMatches[0],
          output: priceMatches[1],
          cacheWrite: 0,
          cacheRead: 0,
        };
        break;
      }
    }
  }

  return prices;
}

// ---------------------------------------------------------------------------
// Comparison and update
// ---------------------------------------------------------------------------

function comparePricing(current, fetched) {
  const diffs = [];

  for (const [model, fetchedPrices] of Object.entries(fetched)) {
    const currentPrices = current[model];
    if (!currentPrices) {
      diffs.push({ model, type: "new_model", fetched: fetchedPrices });
      continue;
    }

    for (const field of ["input", "output", "cacheWrite", "cacheRead"]) {
      if (
        fetchedPrices[field] !== undefined &&
        Math.abs(fetchedPrices[field] - currentPrices[field]) > 0.001
      ) {
        diffs.push({
          model,
          field,
          current: currentPrices[field],
          fetched: fetchedPrices[field],
        });
      }
    }
  }

  return diffs;
}

function updatePricingFile(source, diffs) {
  let updated = source;

  for (const diff of diffs) {
    if (diff.type === "new_model") continue;

    const { model, field, fetched } = diff;
    const modelEscaped = model.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const entryRe = new RegExp(
      `("${modelEscaped}":\\s*\\{[^}]*?)${field}:\\s*[\\d.]+`,
      "s"
    );
    updated = updated.replace(entryRe, `$1${field}: ${fetched}`);
  }

  // Update the "Last verified" date
  const today = new Date().toISOString().slice(0, 10);
  updated = updated.replace(
    /Last verified: \d{4}-\d{2}-\d{2}/,
    `Last verified: ${today}`
  );

  return updated;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const source = readFileSync(PRICING_FILE, "utf-8");
  const current = parsePricingTable(source);

  console.log(
    `Loaded ${Object.keys(current).length} models from pricing table.\n`
  );

  // Check if Playwright is available
  let hasPlaywright = false;
  try {
    await import("playwright");
    hasPlaywright = true;
  } catch {
    // not installed
  }

  // ── Anthropic (server-rendered — always works) ──
  console.log("Checking Anthropic pricing...");
  const anthropic = await fetchAnthropicPricing();
  const anthropicCount = Object.keys(anthropic).length;
  console.log(
    `  Extracted ${anthropicCount}/${ANTHROPIC_MODELS.length} models` +
      (anthropicCount === 0
        ? " — page format may have changed, manual review needed"
        : `: ${Object.keys(anthropic).join(", ")}`)
  );

  // ── OpenAI (client-rendered — needs Playwright) ──
  console.log("Checking OpenAI pricing...");
  let openai = {};
  if (hasPlaywright) {
    try {
      openai = await fetchOpenAIPricing();
      const openaiCount = Object.keys(openai).length;
      console.log(
        `  Extracted ${openaiCount}/${OPENAI_MODELS.length} models` +
          (openaiCount === 0
            ? " — page format may have changed, manual review needed"
            : `: ${Object.keys(openai).join(", ")}`)
      );
    } catch (err) {
      console.warn(`  Failed: ${err.message}`);
      console.log(
        "  Manual review: https://platform.openai.com/docs/pricing"
      );
    }
  } else {
    console.log(
      "  Playwright not installed, skipping. Manual review: https://platform.openai.com/docs/pricing"
    );
  }

  // ── Google (client-rendered — needs Playwright) ──
  console.log("Checking Google pricing...");
  let google = {};
  if (hasPlaywright) {
    try {
      google = await fetchGooglePricing();
      const googleCount = Object.keys(google).length;
      console.log(
        `  Extracted ${googleCount}/${GOOGLE_MODELS.length} models` +
          (googleCount === 0
            ? " — page format may have changed, manual review needed"
            : `: ${Object.keys(google).join(", ")}`)
      );
    } catch (err) {
      console.warn(`  Failed: ${err.message}`);
      console.log(
        "  Manual review: https://ai.google.dev/gemini-api/docs/pricing"
      );
    }
  } else {
    console.log(
      "  Playwright not installed, skipping. Manual review: https://ai.google.dev/gemini-api/docs/pricing"
    );
  }

  const allFetched = { ...anthropic, ...openai, ...google };
  const fetchedCount = Object.keys(allFetched).length;

  if (fetchedCount === 0) {
    console.error(
      "\n⚠️  Could not extract pricing from any provider page."
    );
    console.error(
      "   The page formats may have changed. Manual review needed."
    );
    return;
  }

  const diffs = comparePricing(current, allFetched);

  if (diffs.length === 0) {
    console.log(
      `\n✅ All ${fetchedCount} extracted prices match the current pricing table.`
    );
    return;
  }

  console.log(`\n🔄 Found ${diffs.length} pricing difference(s):\n`);
  for (const diff of diffs) {
    if (diff.type === "new_model") {
      console.log(
        `  NEW: ${diff.model} — input: $${diff.fetched.input}, output: $${diff.fetched.output}`
      );
    } else {
      console.log(
        `  ${diff.model}.${diff.field}: $${diff.current} → $${diff.fetched}`
      );
    }
  }

  const fieldDiffs = diffs.filter((d) => d.type !== "new_model");
  if (fieldDiffs.length > 0) {
    const updated = updatePricingFile(source, fieldDiffs);
    writeFileSync(PRICING_FILE, updated);
    console.log("\n📝 Updated cli/src/pricing.ts with new prices.");
  }

  const newModels = diffs.filter((d) => d.type === "new_model");
  if (newModels.length > 0) {
    console.log(
      "\n⚠️  New models detected but NOT auto-added (needs manual review):"
    );
    for (const m of newModels) {
      console.log(`  ${m.model}: ${JSON.stringify(m.fetched)}`);
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
