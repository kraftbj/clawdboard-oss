export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <header className="border-b border-border bg-background/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-24 animate-pulse rounded bg-surface" />
            <div className="hidden sm:block h-4 w-20 animate-pulse rounded bg-surface" />
          </div>
        </div>
        <div className="h-px bg-border" />
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 space-y-6">
        {/* Back link */}
        <div className="h-4 w-32 animate-pulse rounded bg-surface" />

        {/* Heading */}
        <div className="h-6 w-48 animate-pulse rounded bg-surface" />

        {/* Section cards */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-surface p-4 space-y-3"
          >
            <div className="h-4 w-28 animate-pulse rounded bg-border" />
            <div className="h-8 w-full animate-pulse rounded bg-border" />
          </div>
        ))}
      </main>
    </div>
  );
}
