/**
 * Validates a user-provided URL: checks protocol and blocks private/reserved IPs (SSRF protection).
 * Returns the normalized href on success, or an error string on failure.
 */
export function validatePublicUrl(raw: string): { href: string } | { error: string } {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return { error: "Invalid URL. Must be a valid http:// or https:// URL." };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { error: "Invalid protocol" };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block loopback
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]" ||
    hostname === "0.0.0.0"
  ) {
    return { error: "Private addresses are not allowed" };
  }

  // Block private IP ranges (10.x, 172.16-31.x, 192.168.x, 169.254.x)
  const privateIpPattern =
    /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|169\.254\.\d{1,3}\.\d{1,3})$/;
  if (privateIpPattern.test(hostname)) {
    return { error: "Private addresses are not allowed" };
  }

  return { href: parsed.href };
}
