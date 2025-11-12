"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [status, setStatus] = useState("Loading...");
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/checkout/${sessionId}`)
      .then((r) => r.json())
      .then((d) => setStatus(d.payment_status === "paid" ? "Payment Successful 🎉" : "Payment pending or failed."))
      .catch(() => setStatus("Unable to verify payment."));
  }, [sessionId]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <h1 className="text-4xl font-bold text-yellow-400">{status}</h1>
    </main>
  );
}
