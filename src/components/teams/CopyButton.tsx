"use client";

export function CopyButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(text)}
      className="rounded-md border border-accent bg-accent/10 px-3 py-1.5 font-mono text-xs font-medium text-accent transition-all hover:bg-accent/20"
    >
      Copy Link
    </button>
  );
}
