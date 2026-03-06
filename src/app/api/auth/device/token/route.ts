import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { deviceCodes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, { key: "device-token", limit: 12 });
  if (limited) return limited;

  try {
    let body: { device_code?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { device_code } = body;
    if (
      !device_code ||
      typeof device_code !== "string" ||
      !/^[0-9a-f]{64}$/.test(device_code)
    ) {
      return NextResponse.json(
        { error: "Missing or invalid device_code" },
        { status: 400 }
      );
    }

    // Look up by the long polling device_code
    const [record] = await db
      .select()
      .from(deviceCodes)
      .where(eq(deviceCodes.deviceCode, device_code))
      .limit(1);

    // Not found or expired
    if (!record || record.expiresAt < new Date()) {
      // Clean up expired record if it exists
      if (record) {
        await db.delete(deviceCodes).where(eq(deviceCodes.code, record.code));
      }
      return NextResponse.json({ error: "expired_token" }, { status: 400 });
    }

    // Not yet claimed by user in the web UI
    if (!record.claimed) {
      return NextResponse.json(
        { error: "authorization_pending" },
        { status: 400 }
      );
    }

    // Claimed -- return the API token and delete the device code (one-time use)
    const apiToken = record.apiToken;

    await db.delete(deviceCodes).where(eq(deviceCodes.code, record.code));

    return NextResponse.json({ api_token: apiToken });
  } catch (error) {
    console.error("Device token polling error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
