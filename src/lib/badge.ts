/**
 * Generate a "for-the-badge" style SVG badge using template literals.
 * Taller, bolder, uppercase — more visually distinctive than the flat style.
 * No external dependencies -- pure string output.
 */

interface BadgeOptions {
  label: string; // Left segment text (e.g., "clawdboard")
  value: string; // Right segment text (e.g., "#3 | 12d streak")
  labelColor?: string; // Hex without #, default "2b2b2b"
  color?: string; // Hex without #, default "F9A615" (marigold)
}

/** Escape XML special characters for defense-in-depth against SVG injection. */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Build the badge image URL, profile URL, and markdown snippet for a user. */
export function buildBadgeSnippet(username: string, baseUrl: string) {
  const badgeUrl = `${baseUrl}/api/badge/${encodeURIComponent(username)}`;
  const profileUrl = `${baseUrl}/user/${encodeURIComponent(username)}`;
  const snippet = `[![clawdboard](${badgeUrl})](${profileUrl})`;
  return { badgeUrl, profileUrl, snippet };
}

export function generateBadgeSvg(opts: BadgeOptions): string {
  const label = escapeXml(opts.label.toUpperCase());
  const value = escapeXml(opts.value.toUpperCase());
  const labelColor = opts.labelColor ?? "2b2b2b";
  const color = opts.color ?? "F9A615";

  // "for-the-badge" style: taller (28px), uppercase, bolder, wider padding
  const HEIGHT = 28;
  const FONT_SIZE = 100; // 10x scale
  const CHAR_WIDTH = 75;
  const SEGMENT_PADDING = 180; // wider padding for breathing room

  const labelTextWidth = opts.label.length * CHAR_WIDTH;
  const valueTextWidth = opts.value.length * CHAR_WIDTH;
  const labelWidth = labelTextWidth + SEGMENT_PADDING;
  const valueWidth = valueTextWidth + SEGMENT_PADDING;
  const totalWidth = labelWidth + valueWidth;

  // Scale factor: SVG uses 10x internal coordinates for precision
  const svgWidth = totalWidth / 10;

  // Text x-positions (center of each segment, in 10x coordinates)
  const labelX = labelWidth / 2;
  const valueX = labelWidth + valueWidth / 2;

  // Vertical text position: centered in 28px height (280 in 10x), baseline at ~65%
  const textY = 175;
  const shadowY = 185;

  const ariaLabel = `${opts.label}: ${opts.value}`;

  // Determine value text color: dark text on bright backgrounds, white on dark
  const valueTextColor = color === "999" ? "#fff" : "#1a1a1a";
  const valueShadowColor = color === "999" ? "#010101" : "#fff";
  const valueShadowOpacity = color === "999" ? ".3" : ".2";

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${svgWidth}" height="${HEIGHT}" role="img" aria-label="${escapeXml(ariaLabel)}">
  <title>${escapeXml(ariaLabel)}</title>
  <clipPath id="r">
    <rect width="${svgWidth}" height="${HEIGHT}" rx="4" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth / 10}" height="${HEIGHT}" fill="#${labelColor}"/>
    <rect x="${labelWidth / 10}" width="${valueWidth / 10}" height="${HEIGHT}" fill="#${color}"/>
  </g>
  <g text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="${FONT_SIZE}">
    <text aria-hidden="true" x="${labelX}" y="${shadowY}" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${labelTextWidth}" lengthAdjust="spacing" font-weight="bold">${label}</text>
    <text x="${labelX}" y="${textY}" transform="scale(.1)" fill="#fff" textLength="${labelTextWidth}" lengthAdjust="spacing" font-weight="bold">${label}</text>
    <text aria-hidden="true" x="${valueX}" y="${shadowY}" fill="${valueShadowColor}" fill-opacity="${valueShadowOpacity}" transform="scale(.1)" textLength="${valueTextWidth}" lengthAdjust="spacing" font-weight="bold">${value}</text>
    <text x="${valueX}" y="${textY}" transform="scale(.1)" fill="${valueTextColor}" textLength="${valueTextWidth}" lengthAdjust="spacing" font-weight="bold">${value}</text>
  </g>
</svg>`;
}
