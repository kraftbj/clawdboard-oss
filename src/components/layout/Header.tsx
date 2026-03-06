import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface HeaderProps {
  subtitle?: string;
  rightContent?: ReactNode;
  linkHome?: boolean;
}

export function Header({
  subtitle,
  rightContent,
  linkHome = true,
}: HeaderProps) {
  const logo = (
    <span className="flex items-center gap-2">
      <Image src="/logo.png" alt="" width={24} height={36} className="h-9 w-auto" />
      clawdboard
      <span className="animate-blink ml-0.5 text-accent">_</span>
    </span>
  );

  return (
    <header className="relative z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-3">
          {linkHome ? (
            <Link
              href="/"
              className="flex items-center font-display text-xl font-bold tracking-tight text-foreground"
            >
              {logo}
            </Link>
          ) : (
            <span className="flex items-center font-display text-xl font-bold tracking-tight text-foreground">
              {logo}
            </span>
          )}
          {subtitle && (
            <span className="hidden sm:inline-block font-mono text-xs text-muted">
              {`// ${subtitle}`}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {rightContent}
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
    </header>
  );
}
