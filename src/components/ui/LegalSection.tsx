import type { ReactNode } from "react";

export function Section({
  num,
  title,
  children,
}: {
  num: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-base font-semibold text-foreground mb-2">
        <span className="text-accent mr-2 font-mono text-sm">
          [{String(num).padStart(2, "0")}]
        </span>
        {title}
      </h2>
      <div className="font-mono text-sm leading-relaxed text-muted pl-10">
        {children}
      </div>
    </section>
  );
}

export function Item({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="text-dim select-none">—</span>
      <span>{children}</span>
    </li>
  );
}
