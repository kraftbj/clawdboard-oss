"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b",
          color: "#fafafa",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div style={{ textAlign: "center", padding: "1rem" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: "1px solid rgba(248,113,113,0.3)",
              backgroundColor: "rgba(248,113,113,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              fontSize: 28,
              fontWeight: 700,
              color: "#f87171",
            }}
          >
            !
          </div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              margin: "0 0 0.5rem",
            }}
          >
            Critical Error
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#a1a1aa",
              margin: "0 0 1.5rem",
              maxWidth: 360,
            }}
          >
            The application encountered a critical error and could not recover.
          </p>
          <button
            onClick={() => reset()}
            style={{
              backgroundColor: "#F9A615",
              color: "#09090b",
              border: "none",
              borderRadius: 8,
              padding: "0.5rem 1rem",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
