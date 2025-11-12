"use client";

import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function ApplePayButton() {
  const [paymentRequest, setPaymentRequest] = useState<any>(null);

  useEffect(() => {
    async function setup() {
      const stripe = await stripePromise;
      if (!stripe) return;

      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: { label: "AI Greeting Video", amount: 399 },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      const canPay = await pr.canMakePayment();
      if (canPay && canPay.applePay) setPaymentRequest(pr);

      pr.on("paymentmethod", async (e) => {
        const res = await fetch("/api/payment", {
          method: "POST",
          body: JSON.stringify({ type: "wallet" }),
        });

        const { clientSecret } = await res.json();

        const { error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: e.paymentMethod.id,
        });

        e.complete(error ? "fail" : "success");
        alert(error ? "Payment failed" : "Payment successful 🎉");
      });
    }

    setup();
  }, []);

  const handleApplePayClick = async () => {
    if (!paymentRequest) {
      alert("Apple Pay is not available on this device or browser.");
      return;
    }
    await paymentRequest.show();
  };

  return (
    <button
      type="button"
      onClick={handleApplePayClick}
      aria-label="Pay with Apple Pay"
      className="w-full h-full flex items-center justify-center p-3 cursor-pointer disabled:cursor-not-allowed"
    >
      <div className="w-full h-[100px] md:h-[120px] lg:h-[140px] flex items-center justify-center">
        <img
          src="/payment/apple-pay.svg"
          alt="Apple Pay"
          className="h-[57px] md:h-[65px] lg:h-[73px] w-auto object-contain"
        />
      </div>
    </button>
  );
}
