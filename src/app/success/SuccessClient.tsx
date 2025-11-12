"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessClient() {
  const [status, setStatus] = useState("Loading...");
  const params = useSearchParams();
  const sessionId = params?.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setStatus("No session id provided.");
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/checkout/${encodeURIComponent(sessionId)}`);
        if (!res.ok) {
          setStatus("Unable to verify payment.");
          return;
        }
        const d = await res.json();
        if (!mounted) return;
        setStatus(d?.payment_status === "paid" ? "Payment Successful 🎉" : "Payment pending or failed.");
      } catch (err) {
        if (!mounted) return;
        setStatus("Unable to verify payment.");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [sessionId]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <h1 className="text-4xl font-bold text-yellow-400">{status}</h1>
    </main>
  );
}