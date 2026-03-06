// ─── Shared OG Image Font Loading ─────────────────────────────────────────
// Loads Google Fonts as TTF ArrayBuffers for Satori-based OG image generation.
// Shared by profile OG image and achievement OG image routes.

/**
 * Fetch a Google Font as a TTF ArrayBuffer for use with Satori / next/og.
 *
 * Fetches the CSS without a browser User-Agent header so Google returns
 * TTF format (not WOFF2 which Satori cannot use).
 */
export async function loadGoogleFont(
  family: string,
  weight: string
): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`;
  const css = await (await fetch(url)).text();
  const match = css.match(
    /src: url\((.+?)\) format\('(opentype|truetype)'\)/
  );
  if (!match) throw new Error(`Failed to load font: ${family}`);
  return await (await fetch(match[1])).arrayBuffer();
}
