"use client";

import { useEffect } from "react";

/*
 * The last resort. `error.tsx` catches a page failing inside the layout; this
 * catches the layout itself failing, which means no header, no footer, no fonts
 * and no Tailwind. Everything here is therefore inline and self-contained, and
 * it renders its own <html> and <body> because there is no shell left to sit in.
 *
 * Brand colours are written as literals for the same reason: the stylesheet
 * that defines the tokens is exactly what may not have loaded.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with the error monitoring service once one is configured.
    console.error(error);
  }, [error]);

  return (
    <html lang="en-GB">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "#faf8f3",
          color: "#242424",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
        }}
      >
        <main style={{ maxWidth: "34rem", textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              color: "#4a1414",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "28px",
            }}
          >
            efamy
          </p>

          <h1
            style={{
              margin: "20px 0 0",
              color: "#8b2d2d",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "24px",
              fontWeight: 400,
            }}
          >
            Something went wrong at our end
          </h1>

          <p
            style={{
              margin: "12px 0 0",
              color: "#676159",
              fontSize: "16px",
              lineHeight: 1.6,
            }}
          >
            This is our fault, not yours. Nothing you were doing has been lost:
            if you were part-way through paying, no payment was taken, and your
            basket is still on this device.
          </p>

          <div
            style={{
              marginTop: "28px",
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                minHeight: "44px",
                padding: "0 24px",
                border: "none",
                borderRadius: "999px",
                background: "#8b2d2d",
                color: "#ffffff",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/*
              A real navigation, not a Link. Client-side routing runs inside the
              React tree that has just failed, so the one thing that reliably
              works here is asking the browser for a fresh page.
            */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                minHeight: "44px",
                display: "inline-flex",
                alignItems: "center",
                padding: "0 24px",
                borderRadius: "999px",
                border: "1px solid #d5cec3",
                color: "#242424",
                fontSize: "15px",
                textDecoration: "none",
              }}
            >
              Go to the home page
            </a>
          </div>

          <p style={{ margin: "24px 0 0", color: "#676159", fontSize: "14px" }}>
            Still stuck? Write to{" "}
            <a href="mailto:info@efamy.co.uk" style={{ color: "#8b2d2d" }}>
              info@efamy.co.uk
            </a>
            {error.digest ? (
              <>
                {" "}
                and quote{" "}
                <span style={{ fontFamily: "ui-monospace, monospace" }}>
                  {error.digest}
                </span>
              </>
            ) : null}
            .
          </p>
        </main>
      </body>
    </html>
  );
}
