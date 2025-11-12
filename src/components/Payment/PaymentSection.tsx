"use client";

import React, { useState, useEffect, KeyboardEvent } from "react";
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
      if ((e as KeyboardEvent).key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey as any);
    return () => window.removeEventListener("keydown", onKey as any);
  }, [onClose]);

  const apiPost = async (body: Record<string, unknown>) => {
    const res = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Server error: ${res.status} ${text}`);
    }
    return res.json();
  };

  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      const data = await apiPost({ type: "checkout" });
      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error("No redirect URL from server:", data);
      }
    } catch (err) {
      console.error("Stripe checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWallet = async (wallet: "apple" | "google") => {
    setLoading(true);
    try {
      const data = await apiPost({ type: "wallet", wallet });
      if (data?.url) {
        // server may return a URL to redirect to or a client intent token
        window.location.href = data.url;
      } else {
        // if the wallet component handles the next step (e.g. PaymentRequest), you can call onSuccess here
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error(`${wallet} pay error:`, err);
    } finally {
      setLoading(false);
    }
  };

  const buttonWrapClass =
    "w-full h-14 rounded-xl flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all duration-[var(--duration-medium)] ease-[var(--ease-golden)] cursor-pointer";

  const buttonClass =
    "w-full h-14 rounded-xl flex items-center justify-center gap-3 bg-[#e5e5e5] text-black font-medium transition-colors duration-[var(--duration-medium)] ease-[var(--ease-golden)] hover:bg-gray-300 relative z-10 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden";

  const renderClickable = (
    children: React.ReactNode,
    onClick: () => void,
    ariaLabel?: string
  ) => (
    <div
      className={buttonWrapClass}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.preventDefault();
        if (!loading) onClick();
      }}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !loading) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className={buttonClass + (loading ? " pointer-events-none" : "")}>
        {children}
      </div>
    </div>
  );

  const content = (
    <section className="flex flex-col items-center w-full mt-2">
      <div className="flex flex-col w-full gap-2">
        <Elements stripe={stripePromise}>
          {renderClickable(<ApplePayButton />, () => handleWallet("apple"), "Apple Pay")}
          {renderClickable(<GooglePayButton />, () => handleWallet("google"), "Google Pay")}
          {renderClickable(<PayPalButton />, () => {
            // If PayPal needs server kickoff change body accordingly
            window.location.href = "/api/payment?type=paypal";
          }, "PayPal")}
          {renderClickable(<StripePayButton />, handleStripeCheckout, "Card / Stripe Checkout")}
        </Elements>
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
