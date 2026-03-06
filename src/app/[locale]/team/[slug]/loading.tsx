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
        {/* Heading row + time filter placeholder */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-6 w-40 animate-pulse rounded bg-surface" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-7 w-14 animate-pulse rounded-full bg-surface"
              />
            ))}
          </div>
        </div>

        {/* Team card skeleton */}
        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="mb-6">
            <div className="h-4 w-32 animate-pulse rounded bg-border" />
          </div>
          {/* Stat boxes */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-background p-4">
                <div className="h-3 w-16 animate-pulse rounded bg-border mb-2" />
                <div className="h-6 w-20 animate-pulse rounded bg-border" />
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard table skeleton */}
        <div className="rounded-lg border border-border bg-surface">
          {/* Table header */}
          <div className="flex items-center gap-4 border-b border-border px-4 py-3">
            <div className="h-3 w-6 animate-pulse rounded bg-border" />
            <div className="h-3 w-24 animate-pulse rounded bg-border" />
            <div className="ml-auto flex gap-6">
              <div className="h-3 w-14 animate-pulse rounded bg-border" />
              <div className="h-3 w-14 animate-pulse rounded bg-border" />
              <div className="hidden sm:block h-3 w-14 animate-pulse rounded bg-border" />
            </div>
          </div>
          {/* Table rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-border/50 px-4 py-3"
            >
              <div className="h-4 w-5 animate-pulse rounded bg-border" />
              <div className="h-8 w-8 animate-pulse rounded-full bg-border" />
              <div className="h-4 w-28 animate-pulse rounded bg-border" />
              <div className="ml-auto flex gap-6">
                <div className="h-4 w-14 animate-pulse rounded bg-border" />
                <div className="h-4 w-14 animate-pulse rounded bg-border" />
                <div className="hidden sm:block h-4 w-14 animate-pulse rounded bg-border" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
