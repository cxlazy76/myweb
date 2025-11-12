"use client";

import React, { useState } from "react";

export default function GooglePayButton() {
  const [loading, setLoading] = useState(false);

  const handleGooglePay = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/checkout", { method: "POST" });
      if (!res.ok) throw new Error("Failed to start payment");

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Could not process payment.");
      }
    } catch (err) {
      console.error("Google Pay error:", err);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGooglePay}
      disabled={loading}
      aria-label="Pay with Google Pay"
      className="w-full h-full flex items-center justify-center p-3 cursor-pointer disabled:cursor-not-allowed"
    >
      <div className="w-full h-20 md:h-24 lg:h-28 flex items-center justify-center">
        <img
          src="/payment/google-pay.svg"
          alt="Google Pay"
          className="h-[70px] md:h-[78px] lg:h-[86px] w-auto object-contain"
        />
      </div>
    </button>
  );
}
