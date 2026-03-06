"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { env } from "@/lib/env";
import { buildInviteUrl } from "@/lib/url";

type CopyAction = "link" | "slack";

interface TeamInviteSectionProps {
  teamSlug: string;
  inviteToken: string;
  isLocked: boolean;
  memberCount: number;
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

function CopiedLabel({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-success">
      <CheckIcon />
      {text}
    </span>
  );
}

function InviteActions({
  inviteUrl,
  slackMessage,
  emailSubject,
  emailBody,
  labels,
}: {
  inviteUrl: string;
  slackMessage: string;
  emailSubject: string;
  emailBody: string;
  labels: { copyLink: string; copyForSlack: string; emailInvite: string; copied: string };
}) {
  const [copiedAction, setCopiedAction] = useState<CopyAction | null>(null);

  const handleCopy = async (text: string, action: CopyAction) => {
    await navigator.clipboard.writeText(text);
    setCopiedAction(action);
    setTimeout(() => setCopiedAction(null), 2000);
  };

  const btnClass =
    "rounded-md border border-border px-3 py-1.5 font-mono text-xs font-medium text-muted transition-all hover:border-border-bright hover:text-foreground cursor-pointer";

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => handleCopy(inviteUrl, "link")}
        className={btnClass}
      >
        {copiedAction === "link" ? <CopiedLabel text={labels.copied} /> : labels.copyLink}
      </button>
      <button
        type="button"
        onClick={() => handleCopy(slackMessage, "slack")}
        className={btnClass}
      >
        {copiedAction === "slack" ? <CopiedLabel text={labels.copied} /> : labels.copyForSlack}
      </button>
      <a
        href={`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
        className={btnClass + " inline-flex items-center no-underline"}
      >
        {labels.emailInvite}
      </a>
    </div>
  );
}

export function TeamInviteSection({
  teamSlug,
  inviteToken,
  isLocked,
  memberCount,
}: TeamInviteSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations("team");

  const inviteUrl = buildInviteUrl(env.NEXT_PUBLIC_BASE_URL, teamSlug, inviteToken);
  const slackMessage = t("slackMessage", { url: inviteUrl });
  const emailSubject = t("emailSubject");
  const emailBody = t("emailBody", { url: inviteUrl });

  const labels = {
    copyLink: t("copyLink"),
    copyForSlack: t("copyForSlack"),
    emailInvite: t("emailInvite"),
    copied: t("copied"),
  };

  const isProminent = memberCount < 5;

  if (isProminent) {
    return (
      <div
        className={`mb-6 rounded-lg border p-4 ${
          isLocked
            ? "border-border bg-card/50"
            : "border-accent/30 bg-accent/5"
        }`}
      >
        <div className="mb-1 font-mono text-sm font-bold text-foreground">
          <span className="text-accent mr-1">$</span> {t("invite")}
        </div>
        {isLocked ? (
          <p className="font-mono text-xs text-muted">
            {t("teamLocked")}
          </p>
        ) : (
          <>
            <p className="mb-3 font-mono text-xs text-muted">
              {t("growTeam")}
            </p>
            <InviteActions
              inviteUrl={inviteUrl}
              slackMessage={slackMessage}
              emailSubject={emailSubject}
              emailBody={emailBody}
              labels={labels}
            />
          </>
        )}
      </div>
    );
  }

  // Compact mode (5+ members)
  return (
    <div className="mb-6">
      {isLocked ? (
        <button
          type="button"
          disabled
          className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted cursor-not-allowed opacity-50"
          title={t("teamLocked")}
        >
          + {t("inviteColleagues")}
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="rounded-full border border-accent/40 px-4 py-1.5 font-mono text-xs text-accent transition-all hover:bg-accent/10 hover:border-accent cursor-pointer"
          >
            {expanded ? `\u2212 ${t("inviteColleagues")}` : `+ ${t("inviteColleagues")}`}
          </button>
          {expanded && (
            <div
              className="mt-3"
              style={{ animation: "fadeInUp 0.2s ease-out both" }}
            >
              <InviteActions
                inviteUrl={inviteUrl}
                slackMessage={slackMessage}
                emailSubject={emailSubject}
                emailBody={emailBody}
                labels={labels}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
