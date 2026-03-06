import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { pageVisits } from "@/lib/db/schema";
import { and, eq, gt } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(null, { status: 204 });
  }

  let pathname: string;
  try {
    const body = await req.json();
    pathname = typeof body.pathname === "string" ? body.pathname : "/";
  } catch {
    return new Response(null, { status: 204 });
  }

  // Server-side debounce: skip if same user + pathname within last 60 seconds
  const cutoff = new Date(Date.now() - 60_000);
  const [existing] = await db
    .select({ id: pageVisits.id })
    .from(pageVisits)
    .where(
      and(
        eq(pageVisits.userId, session.user.id),
        eq(pageVisits.pathname, pathname),
        gt(pageVisits.visitedAt, cutoff)
      )
    )
    .limit(1);

  if (!existing) {
    await db.insert(pageVisits).values({
      userId: session.user.id,
      pathname,
    });
  }

  return new Response(null, { status: 204 });
}
