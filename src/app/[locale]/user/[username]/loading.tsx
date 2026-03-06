export default function Loading() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Header skeleton */}
      <header className="border-b border-border bg-background/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-24 animate-pulse rounded bg-surface" />
            <div className="hidden sm:block h-4 w-28 animate-pulse rounded bg-surface" />
          </div>
        </div>
        <div className="h-px bg-border" />
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
        {/* Back link */}
        <div className="h-4 w-32 animate-pulse rounded bg-surface" />

        {/* Profile card skeleton */}
        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 animate-pulse rounded-full bg-border" />
              <div className="space-y-2">
                <div className="h-6 w-40 animate-pulse rounded bg-border" />
                <div className="h-4 w-28 animate-pulse rounded bg-border" />
              </div>
            </div>
            <div className="h-9 w-20 animate-pulse rounded-lg bg-border" />
          </div>
          {/* Stat boxes */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-background p-4">
                <div className="h-3 w-16 animate-pulse rounded bg-border mb-2" />
                <div className="h-6 w-20 animate-pulse rounded bg-border" />
              </div>
            ))}
          </div>
        </div>

        {/* Activity grid skeleton */}
        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="h-5 w-28 animate-pulse rounded bg-border mb-4" />
          <div className="h-28 w-full animate-pulse rounded bg-border" />
        </div>

        {/* Chart skeleton */}
        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="h-5 w-24 animate-pulse rounded bg-border mb-4" />
          <div className="h-48 w-full animate-pulse rounded bg-border" />
        </div>

        {/* Model breakdown skeleton */}
        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="h-5 w-36 animate-pulse rounded bg-border mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-4 w-32 animate-pulse rounded bg-border" />
                <div className="h-4 flex-1 animate-pulse rounded bg-border" />
                <div className="h-4 w-16 animate-pulse rounded bg-border" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
