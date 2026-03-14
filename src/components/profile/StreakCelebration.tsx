"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getStreakTier } from "@/lib/streak-tiers";
import {
  buildStreakShareText,
  buildTwitterIntentUrl,
  buildLinkedInShareUrl,
} from "@/lib/share";
import { buildInviteUrl } from "@/lib/url";
import { env } from "@/lib/env";

interface StreakCelebrationProps {
  username: string;
  currentStreak: number;
  isOwner: boolean;
  team?: {
    teamName: string;
    teamSlug: string;
    inviteToken: string;
  };
}

// ─── localStorage helpers ───────────────────────────────────────────────────

function getLastSeenTier(username: string): number {
  try {
    const raw = localStorage.getItem(`clawdboard-streak-tier-${username}`);
    if (!raw) return -1;
    const n = parseInt(raw, 10);
    return Number.isNaN(n) ? -1 : n;
  } catch {
    return -1;
  }
}

function setLastSeenTier(username: string, tier: number): void {
  try {
    localStorage.setItem(`clawdboard-streak-tier-${username}`, String(tier));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

// ─── Icons ──────────────────────────────────────────────────────────────────

function XIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

const shareBtn =
  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border hover:border-border-bright text-muted hover:text-foreground transition-colors text-xs font-mono cursor-pointer";

export function StreakCelebration({
  username,
  currentStreak,
  isOwner,
  team,
}: StreakCelebrationProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const dismiss = useCallback(() => {
    setShowCelebration(false);
  }, []);

  const profileUrl = `https://clawdboard.ai/user/${username}`;
  const shareText = buildStreakShareText(currentStreak);

  const handleTwitter = useCallback(() => {
    window.plausible?.("StreakShare", { props: { method: "twitter" } });
    window.open(
      buildTwitterIntentUrl(shareText, profileUrl),
      "_blank",
      "noopener,noreferrer"
    );
  }, [shareText, profileUrl]);

  const handleLinkedIn = useCallback(() => {
    window.plausible?.("StreakShare", { props: { method: "linkedin" } });
    window.open(
      buildLinkedInShareUrl(profileUrl),
      "_blank",
      "noopener,noreferrer"
    );
  }, [profileUrl]);

  const handleCopyLink = useCallback(async () => {
    window.plausible?.("StreakShare", { props: { method: "copy_link" } });
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [profileUrl]);

  const inviteUrl = team
    ? buildInviteUrl(env.NEXT_PUBLIC_BASE_URL, team.teamSlug, team.inviteToken)
    : null;

  const handleCopyInvite = useCallback(async () => {
    if (!inviteUrl) return;
    window.plausible?.("Invite_Copied", { props: { source: "streak_celebration" } });
    await navigator.clipboard.writeText(inviteUrl);
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2000);
  }, [inviteUrl]);

  useEffect(() => {
    if (!isOwner) return;

    const currentTier = getStreakTier(currentStreak);
    const lastSeenTierNum = getLastSeenTier(username);

    // No celebration for tier 0 or if tier hasn't increased
    if (currentTier.tier === 0) return;
    if (currentTier.tier <= lastSeenTierNum) return;

    // Only persist when the tier is new (higher) — never downgrade,
    // so a temporary streak dip won't re-trigger celebrations later.
    setLastSeenTier(username, currentTier.tier);

    setShowCelebration(true);

    // No confetti for tiers without celebration config (Spark)
    const celebration = currentTier.celebration;
    if (!celebration) return;

    // Fire confetti if not reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let burstTimer: ReturnType<typeof setTimeout>;

    (async () => {
      try {
        const confettiModule = await import("canvas-confetti");
        if (cancelled) return;

        const confettiCreate =
          confettiModule.default?.create ?? confettiModule.create;
        if (!confettiCreate) return;

        const confetti = confettiCreate(canvas, {
          resize: true,
          useWorker: true,
        });

        // First burst — tier-scaled
        confetti({
          particleCount: celebration.particleCount,
          spread: celebration.spread,
          origin: { x: 0.5, y: 0.45 },
          colors: celebration.confettiColors,
          startVelocity: 30,
          gravity: 0.8,
          ticks: 150,
          scalar: 0.9,
        });

        // Second burst — smaller follow-up
        burstTimer = setTimeout(() => {
          if (cancelled) return;
          confetti({
            particleCount: celebration.secondBurstCount,
            spread: celebration.spread * 0.6,
            origin: { x: 0.5, y: 0.45 },
            colors: celebration.confettiColors,
            startVelocity: 20,
            gravity: 0.6,
            ticks: 100,
            scalar: 0.7,
          });
        }, 300);
      } catch {
        // Silently fail
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(burstTimer);
    };
  }, [isOwner, username, currentStreak]);

  if (!showCelebration) return null;

  const tier = getStreakTier(currentStreak);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={dismiss}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0"
        style={{ width: "100%", height: "100%" }}
      />

      <div
        className={`relative z-10 flex flex-col items-center gap-4 rounded-2xl border bg-surface p-8 text-center shadow-2xl ${tier.celebration?.modalBorder ?? "border-accent/30"} ${tier.celebration?.modalGlow ?? ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-5xl">{tier.icon || "\uD83D\uDD25"}</span>
        <h2 className={`font-display text-2xl font-bold uppercase tracking-wider ${tier.textColor !== "text-muted" ? tier.textColor : "text-accent"}`}>
          {tier.name} Unlocked
        </h2>
        <p className="font-mono text-lg text-foreground">
          {currentStreak} day streak
        </p>
        <p className="text-sm text-muted">Keep the streak alive!</p>

        {/* Share buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
          <button onClick={handleTwitter} className={shareBtn}>
            <XIcon />
            Post to X
          </button>
          <button onClick={handleLinkedIn} className={shareBtn}>
            <LinkedInIcon />
            LinkedIn
          </button>
          <button onClick={handleCopyLink} className={shareBtn}>
            {copied ? (
              <>
                <CheckIcon />
                <span className="text-success">Copied!</span>
              </>
            ) : (
              <>
                <LinkIcon />
                Copy Link
              </>
            )}
          </button>
        </div>

        {/* Team invite CTA (has-team only) */}
        {team && (
          <button
            onClick={handleCopyInvite}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            {inviteCopied ? (
              <>
                <CheckIcon />
                <span className="text-success">Copied!</span>
              </>
            ) : (
              <>
                <LinkIcon />
                invite teammates to {team.teamName}
              </>
            )}
          </button>
        )}

        <button
          onClick={dismiss}
          className="mt-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
