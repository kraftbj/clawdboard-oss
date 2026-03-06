"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface UserNavProps {
  name: string | null | undefined;
  image: string | null | undefined;
}

export function UserNav({ name, image }: UserNavProps) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });

  // Need to wait for mount before using createPortal
  useEffect(() => setMounted(true), []);

  // Click-outside handler
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        buttonRef.current && !buttonRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Escape key closes dropdown and returns focus to trigger
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Focus first menu item when dropdown opens
  useEffect(() => {
    if (!open) return;
    const firstItem = dropdownRef.current?.querySelector<HTMLElement>(
      '[role="menuitem"]'
    );
    firstItem?.focus();
  }, [open]);

  const dropdown = open && mounted
    ? createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-[9999] w-48 rounded-lg border border-border bg-surface shadow-lg"
          style={{ top: dropdownPos.top, right: dropdownPos.right }}
          role="menu"
        >
          <div className="py-1">
            <Link
              role="menuitem"
              href="/my-team"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-mono text-xs text-foreground/80 transition-colors hover:bg-surface-hover"
            >
              {t("myTeam")}
            </Link>
            <div className="my-1 border-t border-border" />
            <Link
              role="menuitem"
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-mono text-xs text-foreground/80 transition-colors hover:bg-surface-hover"
            >
              {t("settings")}
            </Link>
            <div className="my-1 border-t border-border" />
            <button
              role="menuitem"
              type="button"
              onClick={async () => {
                const { signOut } = await import("next-auth/react");
                signOut();
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-mono text-xs text-muted transition-colors hover:text-foreground hover:bg-surface-hover"
            >
              {t("signOut")}
            </button>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <button
        ref={buttonRef}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => {
          if (!open && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const rightOffset = window.innerWidth - rect.right;
            setDropdownPos({
              top: rect.bottom + 8,
              right: Math.max(8, rightOffset),
            });
          }
          setOpen(!open);
        }}
        className="flex items-center gap-3 rounded-md px-1 py-0.5 transition-colors hover:bg-surface-hover"
      >
        {image && (
          <Image
            src={image}
            alt={name ?? "User avatar"}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full ring-1 ring-border"
          />
        )}
        <span className="hidden sm:inline font-mono text-xs text-foreground/80">{name}</span>
      </button>
      {dropdown}
    </>
  );
}
