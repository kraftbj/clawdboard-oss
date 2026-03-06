import { signIn } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { CopyIconButton } from "./CopyIconButton";

export async function JoinBanner({ vibeCoderCount }: { vibeCoderCount: number }) {
  const t = await getTranslations("leaderboard");

  return (
    <div className="mb-4 flex flex-col gap-2 rounded-lg border border-border bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 font-mono text-xs text-dim">
        <span className="shrink-0 text-[10px] font-mono text-muted">
          {"// "}{t("vibeCodersOnBoard", { count: vibeCoderCount })}
        </span>
        <div className="flex items-center gap-2 rounded border border-border bg-background px-3 py-1.5 text-xs">
          <span className="text-dim/60 select-none">$</span>
          <code className="text-foreground/70">npx clawdboard auth</code>
          <CopyIconButton text="npx clawdboard auth" />
        </div>
      </div>
      <form
        action={async () => {
          "use server";
          await signIn("github");
        }}
      >
        <button
          type="submit"
          className="font-mono text-[11px] text-muted transition-colors hover:text-foreground"
        >
          {t("orSignUpWithGithub")} &rarr;
        </button>
      </form>
    </div>
  );
}
