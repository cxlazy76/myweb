"use client";

import React, { useEffect, useState } from "react";

export default function Page() {
  const [status, setStatus] = useState<string>("Checking payment…");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    // Read session_id from the browser URL to avoid useSearchParams suspense bailouts during build.
    const sessionId =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("session_id")
        : null;

    if (!sessionId) {
      if (mounted) {
        setStatus("No session id provided.");
        setLoading(false);
      }
      return () => {
        mounted = false;
      };
    }

    (async () => {
      try {
        const res = await fetch(
          `/api/checkout/${encodeURIComponent(sessionId)}`,
          {
            cache: "no-store",
          }
        );
        if (!res.ok) {
          if (!mounted) return;
          setStatus("Unable to verify payment.");
        } else {
          const data = await res.json();
          if (!mounted) return;
          setStatus(
            data?.payment_status === "paid"
              ? "Payment Successful 🎉"
              : "Payment pending or failed."
          );
        }
      } catch (err) {
        if (!mounted) return;
        console.error("Verify session error:", err);
        setStatus("Unable to verify payment.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      {loading ? (
        <h1 className="text-2xl">Checking payment…</h1>
      ) : (
        <h1 className="text-4xl font-bold text-yellow-400">{status}</h1>
      )}
    </main>
  );
}
