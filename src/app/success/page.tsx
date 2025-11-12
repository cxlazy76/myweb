"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const params = useSearchParams();
  const sessionId = params?.get("session_id");
  const [status, setStatus] = useState<string>("Loading...");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
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
        setStatus("Unable to verify payment.");
        console.error("Verify session error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [sessionId]);

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
