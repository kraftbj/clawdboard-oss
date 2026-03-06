"use client";

import { useEffect, useRef, useState } from "react";
import { CopyIconButton } from "@/components/leaderboard/CopyIconButton";

export function CommandBlock({ command }: { command: string }) {
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = () => {
    setShowHint(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowHint(true), 4000);
  };

  return (
    <div className="mt-3">
      <div className="flex items-center rounded-md border border-border bg-background px-4 py-3 font-mono text-sm">
        <span className="text-muted select-none">$ </span>
        <span className="text-accent-bright">{command}</span>
        <span className="ml-auto">
          <CopyIconButton text={command} onCopy={handleCopy} />
        </span>
      </div>
      <div
        className={`mt-2 overflow-hidden transition-all duration-300 ${showHint ? "max-h-12 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <p className="font-mono text-[11px] text-yellow-400">
          Not working? Install Node.js first by running{" "}
          <code className="rounded bg-yellow-400/10 px-1 py-0.5 text-yellow-300">
            brew install node
          </code>{" "}
          in your terminal.
        </p>
      </div>
    </div>
  );
}
