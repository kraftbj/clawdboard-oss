"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface SortHeaderProps {
  label: string;
  column: string;
  currentSort: string;
  currentOrder: string;
  className?: string;
  tooltip?: string;
}

function SortHeaderInner({
  label,
  column,
  currentSort,
  currentOrder,
  className,
  tooltip,
}: SortHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("sortHeader");

  const isActive = currentSort === column;

  function handleClick() {
    const params = new URLSearchParams(searchParams.toString());
    if (isActive) {
      params.set("order", currentOrder === "desc" ? "asc" : "desc");
    } else {
      params.set("sort", column);
      params.set("order", "desc");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }

  const ariaSort = isActive
    ? currentOrder === "asc"
      ? ("ascending" as const)
      : ("descending" as const)
    : undefined;

  return (
    <th
      aria-sort={ariaSort}
      className={className ?? ""}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label={t("sortBy", { column: label })}
        title={tooltip}
        className={`inline-flex items-center gap-1 select-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-background rounded-sm cursor-pointer ${
          isActive ? "text-accent" : "hover:text-foreground/60"
        }`}
      >
        {label}
        {isActive && (
          <span className="text-[10px] text-accent">
            {currentOrder === "asc" ? "▲" : "▼"}
          </span>
        )}
      </button>
    </th>
  );
}

function SortHeaderFallback({
  label,
  className,
}: Pick<SortHeaderProps, "label" | "className">) {
  return (
    <th className={className ?? ""}>
      <span className="inline-flex items-center gap-1 select-none">
        {label}
      </span>
    </th>
  );
}

export function SortHeader(props: SortHeaderProps) {
  return (
    <Suspense
      fallback={<SortHeaderFallback label={props.label} className={props.className} />}
    >
      <SortHeaderInner {...props} />
    </Suspense>
  );
}
