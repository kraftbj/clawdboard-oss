import { env } from "@/lib/env";
import { routing } from "@/i18n/routing";

const BASE_URL = env.NEXT_PUBLIC_BASE_URL;

/** Build a locale URL respecting localePrefix: "as-needed" (no prefix for en) */
function localeUrl(loc: string, path: string) {
  return loc === "en" ? `${BASE_URL}${path}` : `${BASE_URL}/${loc}${path}`;
}

/** Build alternates object with canonical + hreflang languages for a given path */
export function seoAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = localeUrl(loc, path);
  }
  languages["x-default"] = localeUrl("en", path);
  return {
    canonical: localeUrl("en", path),
    languages,
  };
}
