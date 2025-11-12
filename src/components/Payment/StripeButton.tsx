"use client";

import React from "react";

export default function StripePayButton() {
  const handleCheckout = async () => {
    const res = await fetch("/api/payment", {
      method: "POST",
      body: JSON.stringify({ type: "checkout" }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      className="w-full h-full flex items-center justify-center p-3.8 cursor-pointer"
    >
      <div className="w-full h-25 md:h-31 lg:h-35 flex items-center justify-center">
        <span className="text-black font-medium text-base md:text-lg leading-none">
          Pay with credit or debit card
        </span>
      </div>
    </button>
  );
}
