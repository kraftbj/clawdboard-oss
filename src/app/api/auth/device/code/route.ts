import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { deviceCodes } from "@/lib/db/schema";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Generate a short, human-readable user code (6 alphanumeric uppercase chars).
 * Excludes ambiguous characters (0/O, 1/I/L) for easier typing.
 */
function generateUserCode(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => chars[b % chars.length])
    .join("");
}

/**
 * Generate a long device code for CLI polling (64-char hex string).
 */
function generateDeviceCode(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, { key: "device-code", limit: 5 });
  if (limited) return limited;

  try {
    const userCode = generateUserCode();
    const deviceCode = generateDeviceCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await db.insert(deviceCodes).values({
      code: userCode,
      deviceCode,
      expiresAt,
      claimed: false,
    });

    // Use NEXTAUTH_URL if available, fall back to Vercel URL, then localhost
    const baseUrl = process.env.NEXTAUTH_URL
      ? process.env.NEXTAUTH_URL
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3001";

    return NextResponse.json({
      user_code: userCode,
      device_code: deviceCode,
      verification_url: `${baseUrl}/auth/device?code=${userCode}`,
      expires_in: 900,
      interval: 5,
    });
  } catch (error) {
    console.error("Device code creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
