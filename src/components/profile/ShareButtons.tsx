"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ShareModal } from "./ShareModal";

interface ShareButtonsProps {
  username: string;
  image: string | null;
  rank: number;
  streak: number;
  totalCost: string;
  totalTokens: number;
  totalUsers: number;
  percentile: number;
  profileUrl: string;
}

/** Share icon (box with arrow) */
function ShareIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

export function ShareButtons({
  username,
  image,
  rank,
  streak,
  totalCost,
  totalTokens,
  totalUsers,
  percentile,
  profileUrl,
}: ShareButtonsProps) {
  const t = useTranslations("profile");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border hover:border-border-bright text-muted hover:text-foreground transition-colors text-xs font-mono cursor-pointer"
      >
        <ShareIcon />
        {t("share")}
      </button>
      <ShareModal
        open={open}
        onClose={() => setOpen(false)}
        username={username}
        image={image}
        totalCost={totalCost}
        totalTokens={totalTokens}
        rank={rank}
        totalUsers={totalUsers}
        percentile={percentile}
        streak={streak}
        profileUrl={profileUrl}
      />
    </>
  );
}
