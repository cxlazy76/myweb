"use client";

import React from "react";

export default function PayPalButton({
  onClick,
  disabled,
}: {
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Pay with PayPal"
      className="w-full h-full flex items-center justify-center p-3 cursor-pointer disabled:cursor-not-allowed"
    >
      <div className="w-full h-[90px] md:h-[110px] lg:h-[130px] flex items-center justify-center">
        <img
          src="/payment/paypal-logo.svg"
          alt="PayPal"
          className="h-7 md:h-[30px] lg:h-[34px] w-auto object-contain"
        />
      </div>
    </button>
  );
}
