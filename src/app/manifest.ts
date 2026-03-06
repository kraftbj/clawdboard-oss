import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "clawdboard — Claude Code Usage Leaderboard",
    short_name: "clawdboard",
    description:
      "Track and compare Claude Code usage, costs, tokens, streaks, and model breakdowns across developers.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#F9A615",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
