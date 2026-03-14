import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getUnseenRecaps } from "@/lib/db/recaps";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, { key: "recaps", limit: 60 });
  if (limited) return limited;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const recaps = await getUnseenRecaps(session.user.id);
  return NextResponse.json(recaps);
}
