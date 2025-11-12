"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams?: { session_id?: string };
}) {
  const sessionId = searchParams?.session_id;
  let status = "No session id provided.";

  if (sessionId) {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL ??
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

      const res = await fetch(
        `${baseUrl}/api/checkout/${encodeURIComponent(sessionId)}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        status = "Unable to verify payment.";
      } else {
        const data = await res.json();
        status =
          data?.payment_status === "paid"
            ? "Payment Successful 🎉"
            : "Payment pending or failed.";
      }
    } catch (err) {
      status = "Unable to verify payment.";
      console.error("Verify session error:", err);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <h1 className="text-4xl font-bold text-yellow-400">{status}</h1>
    </main>
  );
}
