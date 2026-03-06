"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CookingForm } from "./CookingForm";
import { DeleteAccountDialog } from "@/components/auth/DeleteAccountDialog";

interface SettingsClientProps {
  username: string;
  cookingUrl: string | null;
  cookingLabel: string | null;
}

export function SettingsClient({
  username,
  cookingUrl,
  cookingLabel,
}: SettingsClientProps) {
  const t = useTranslations("settings");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      {/* Cooking form */}
      <CookingForm currentUrl={cookingUrl} currentLabel={cookingLabel} />

      {/* Export */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => {
            window.location.href = "/api/user/export";
          }}
          className="rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:text-foreground hover:border-foreground/20"
        >
          {t("exportMyData")}
        </button>
        <p className="mt-1.5 font-mono text-[10px] text-dim">
          {t("exportDescription")}
        </p>
      </div>

      {/* Delete account */}
      <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/[0.03] p-4">
        <h3 className="font-mono text-xs font-medium text-red-400/80 mb-1">
          {t("dangerZone")}
        </h3>
        <p className="font-mono text-[10px] text-muted mb-3 leading-relaxed">
          {t("dangerDescription")}
        </p>
        <button
          type="button"
          onClick={() => setShowDeleteDialog(true)}
          className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 font-mono text-xs text-red-400/70 transition-all hover:text-red-400 hover:bg-red-500/20"
        >
          {t("deleteAccount")}
        </button>
      </div>

      {showDeleteDialog && (
        <DeleteAccountDialog
          username={username}
          onClose={() => setShowDeleteDialog(false)}
        />
      )}
    </>
  );
}
