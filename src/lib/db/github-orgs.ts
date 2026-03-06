import { db } from "@/lib/db";
import { accounts, users, userGithubOrgs } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { fetchUserOrgs } from "@/lib/github";

const STALE_MS = 24 * 60 * 60 * 1000; // 24 hours

export function isOrgDataStale(fetchedAt: Date | null): boolean {
  if (!fetchedAt) return true;
  return Date.now() - fetchedAt.getTime() > STALE_MS;
}

export async function syncUserGitHubOrgs(userId: string): Promise<void> {
  try {
    // 1. Look up GitHub access token
    const [account] = await db
      .select({ accessToken: accounts.access_token })
      .from(accounts)
      .where(
        and(eq(accounts.userId, userId), eq(accounts.provider, "github"))
      )
      .limit(1);

    if (!account?.accessToken) {
      console.error("[github-orgs] No GitHub access token for user:", userId);
      return;
    }

    // 2. Fetch orgs from GitHub API
    const orgs = await fetchUserOrgs(account.accessToken);

    // null = API error → bail, keep existing data
    if (orgs === null) return;

    // 3. Replace existing orgs: delete all, then insert fresh
    await db
      .delete(userGithubOrgs)
      .where(eq(userGithubOrgs.userId, userId));

    if (orgs.length > 0) {
      await db.insert(userGithubOrgs).values(
        orgs.map((org) => ({
          userId,
          orgLogin: org.login,
          orgId: String(org.id),
          orgAvatarUrl: org.avatar_url,
        }))
      );
    }

    // 4. Update fetch timestamp
    await db
      .update(users)
      .set({ githubOrgsFetchedAt: new Date() })
      .where(eq(users.id, userId));
  } catch (err) {
    console.error("[github-orgs] syncUserGitHubOrgs failed:", err);
  }
}
