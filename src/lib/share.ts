/**
 * Share text formatting and intent URL builders for social sharing.
 */

/**
 * Build the share text for a user's profile.
 * Format: "Rank #4 | 12-day streak | $1,234 total -- check out my vibecoding stats"
 */
export function buildShareText(
  rank: number,
  streak: number,
  totalCost: string
): string {
  const formattedCost = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(totalCost));
  return `Rank #${rank} | ${streak}-day streak | ${formattedCost} total \u2014 check out my vibecoding stats`;
}

/**
 * Build share text for a streak tier-up celebration.
 */
export function buildStreakShareText(streak: number): string {
  return `I've been vibecoding for ${streak} days straight \u2014 come compete with me on clawdboard.ai!`;
}

/**
 * Build Twitter/X intent URL with pre-populated tweet text.
 * Source: https://developer.x.com/en/docs/x-for-websites/tweet-button/guides/web-intent
 */
export function buildTwitterIntentUrl(text: string, url: string): string {
  const params = new URLSearchParams({ text, url, hashtags: "vibecoding" });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/**
 * Build LinkedIn share intent URL.
 * LinkedIn reads OG tags from the URL automatically.
 */
export function buildLinkedInShareUrl(url: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}
