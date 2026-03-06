import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { CommandBlock } from "./CommandBlock";

interface SetupGuideProps {
  username: string;
  image?: string | null;
}

export async function SetupGuide({ username, image }: SetupGuideProps) {
  const t = await getTranslations("onboarding");

  return (
    <div className="rounded-lg border border-border bg-surface p-8">
      <div className="flex items-center gap-4">
        {image && (
          <Image
            src={image}
            alt={`${username}'s avatar`}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full ring-2 ring-border"
          />
        )}
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            {t("welcome", { username })}
            <span className="animate-blink ml-0.5 text-accent">_</span>
          </h2>
          <p className="mt-1 font-mono text-xs text-muted">
            {"// "}{t("getStarted")}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex gap-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background font-mono text-xs font-bold text-accent">
            01
          </div>
          <div className="flex-1 pb-1">
            <h3 className="font-display text-base font-semibold text-foreground">
              {t("connectAccount")}
            </h3>
            <p className="mt-1.5 font-mono text-xs leading-relaxed text-muted">
              {t("connectDescription")}
            </p>
            <CommandBlock command="npx clawdboard" />
            <p className="mt-2 font-mono text-[11px] text-dim">
              {t("privacyNote")}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-border pt-6 text-center">
        <p className="font-mono text-xs text-dim">
          {t("afterSync")}
        </p>
      </div>
    </div>
  );
}
