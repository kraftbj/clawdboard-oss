import { signIn } from "@/lib/auth";
import { getTranslations } from "next-intl/server";

interface SignInButtonProps {
  redirectTo?: string;
}

export async function SignInButton({ redirectTo }: SignInButtonProps) {
  const t = await getTranslations("auth");

  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", { redirectTo });
      }}
    >
      <button
        type="submit"
        className="rounded-md border border-border bg-surface px-4 py-2 font-mono text-xs font-medium text-foreground transition-all hover:border-accent hover:text-accent hover:shadow-[0_0_12px_rgba(249,166,21,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {t("signInWithGithub")}
      </button>
    </form>
  );
}
