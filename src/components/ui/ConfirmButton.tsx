"use client";

import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";

interface ConfirmButtonProps {
  children: React.ReactNode;
  message?: string;
  pendingText?: string;
  className?: string;
  disabled?: boolean;
}

export function ConfirmButton({
  children,
  message,
  pendingText,
  className,
  disabled,
}: ConfirmButtonProps) {
  const t = useTranslations("common");
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={className}
      onClick={(e) => {
        if (!confirm(message ?? t("confirm"))) {
          e.preventDefault();
        }
      }}
    >
      {pending ? (pendingText ?? children) : children}
    </button>
  );
}
