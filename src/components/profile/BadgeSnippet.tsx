"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BadgeWizardModal } from "@/components/leaderboard/BadgePrompt";

interface BadgeSnippetProps {
  username: string;
  baseUrl: string;
}

/** Code brackets icon for badge button, 16x16 */
function CodeIcon() {
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
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

const buttonClasses =
  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border hover:border-border-bright text-muted hover:text-foreground transition-colors text-xs font-mono cursor-pointer";

export function BadgeSnippet({ username, baseUrl }: BadgeSnippetProps) {
  const t = useTranslations("profile");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className={buttonClasses}>
        <CodeIcon />
        {t("badge")}
      </button>

      <BadgeWizardModal
        open={open}
        onClose={() => setOpen(false)}
        username={username}
        baseUrl={baseUrl}
        initialStep={1}
      />
    </>
  );
}
