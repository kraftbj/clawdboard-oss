export interface GitHubOrg {
  login: string;
  id: number;
  avatar_url: string;
}

/**
 * Fetch the authenticated user's public GitHub org memberships.
 * Returns null on any error (distinct from empty array = zero orgs).
 */
export async function fetchUserOrgs(
  accessToken: string
): Promise<GitHubOrg[] | null> {
  try {
    const res = await fetch(
      "https://api.github.com/user/orgs?per_page=100",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error(
        `[github] /user/orgs returned ${res.status}: ${res.statusText}`
      );
      return null;
    }

    const data: unknown = await res.json();
    if (!Array.isArray(data)) {
      console.error("[github] /user/orgs returned non-array response");
      return null;
    }

    return data as GitHubOrg[];
  } catch (err) {
    console.error("[github] Failed to fetch /user/orgs:", err);
    return null;
  }
}
