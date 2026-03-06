"use client";

import { useState, useActionState } from "react";
import { useTranslations } from "next-intl";
import { createTeam } from "@/actions/teams";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function CreateTeamForm() {
  const [name, setName] = useState("");
  const [state, formAction] = useActionState(createTeam, undefined);
  const t = useTranslations("team");

  const isValid = name.trim().length >= 2 && name.trim().length <= 50;

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <label
          htmlFor="team-name"
          className="mb-1 block font-mono text-xs text-muted"
        >
          {t("teamNameLabel")}
        </label>
        <input
          id="team-name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("teamNamePlaceholder")}
          maxLength={50}
          className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <p className="mt-1 font-mono text-xs text-muted">
          {t("teamNameCount", { count: name.trim().length })}
          {name.trim().length > 0 && name.trim().length < 2 && (
            <span className="text-red-400"> {t("teamNameMin")}</span>
          )}
        </p>
      </div>
      {state?.error && (
        <p className="font-mono text-xs text-red-400">{state.error}</p>
      )}
      <SubmitButton
        disabled={!isValid}
        pendingText={t("creating")}
        className="rounded-md border border-accent bg-accent/10 px-4 py-2 font-mono text-xs font-medium text-accent transition-all hover:bg-accent/20 hover:shadow-[0_0_12px_rgba(249,166,21,0.15)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent/10 disabled:hover:shadow-none"
      >
        {t("createTeam")}
      </SubmitButton>
    </form>
  );
}
