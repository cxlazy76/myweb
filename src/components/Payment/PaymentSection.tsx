"use client";

import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ApplePayButton from "./ApplePayButton";
import PayPalButton from "./PayPalButton";
import GooglePayButton from "./GooglePayButton";
import StripePayButton from "./StripeButton";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function PaymentSection({
  onSuccess,
  onClose,
}: {
  onSuccess?: () => void;
  onClose?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!onClose) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error("Stripe checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const buttonWrapClass =
    "w-full h-14 rounded-xl flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all duration-[var(--duration-medium)] ease-[var(--ease-golden)] cursor-pointer";

  const buttonClass =
    "w-full h-14 rounded-xl flex items-center justify-center gap-3 shadow-sm " +
    "bg-[#e5e5e5] text-black font-medium transition-colors duration-[var(--duration-medium)] " +
    "ease-[var(--ease-golden)] hover:bg-gray-300 " +
    "relative z-10 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden";

  const content = (
    <section className="flex flex-col items-center w-full mt-2">

      <div className="flex flex-col w-full gap-(--space-1)">
        <Elements stripe={stripePromise}>
          <div className={buttonWrapClass}>
            <div className={buttonClass}>
              <ApplePayButton />
            </div>
          </div>
        </Elements>

        <Elements stripe={stripePromise}>
          <div className={buttonWrapClass}>
            <div className={buttonClass}>
              <GooglePayButton
                onClick={handleStripeCheckout}
                disabled={loading}
              />
            </div>
          </div>
        </Elements>

        <div className={buttonWrapClass}>
          <div className={buttonClass}>
            <PayPalButton />
          </div>
        </div>

        <div className={buttonWrapClass}>
          <div className={buttonClass}>
            <StripePayButton
              onClick={handleStripeCheckout}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </section>
  );

  if (onClose) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        role="presentation"
        aria-hidden={false}
      >
        <div
          className="bg-transparent max-w-lg w-full"
          role="dialog"
          aria-modal="true"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  }

  return content;
}
