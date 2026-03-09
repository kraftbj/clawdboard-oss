import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: "Admin access not configured" },
      { status: 403 }
    );
  }

  let password: string;
  try {
    const body = await req.json();
    password = body.password;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  // Create a simple signed token: hash the password so cookie can be verified
  const encoder = new TextEncoder();
  const data = encoder.encode(adminPassword);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const token = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/admin",
  });

  return NextResponse.json({ ok: true });
}
