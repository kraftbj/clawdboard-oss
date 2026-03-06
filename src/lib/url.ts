export function safeHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function buildInviteUrl(baseUrl: string, slug: string, token: string): string {
  return `${baseUrl}/join/${slug}?token=${token}`;
}

export function buildProfileHref(
  username: string,
  period?: string,
  rangeFrom?: string,
  rangeTo?: string
): string {
  const base = `/user/${username}`;
  if (!period || period === "7d") return base;
  if (period === "custom" && rangeFrom && rangeTo) {
    return `${base}?period=custom&from=${rangeFrom}&to=${rangeTo}`;
  }
  return `${base}?period=${period}`;
}
