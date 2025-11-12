"use client";

import { useEffect, useRef } from "react";
import useIsMobile from "@/hooks/useIsMobile";

export default function AutoResizeTextarea({
  value,
  onChange,
  id,
  placeholder,
  maxLength = 100,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  id?: string;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const resize = () => {
      if (isMobile) {
        el.style.boxSizing = "border-box";
        el.style.overflow = "hidden";
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      } else {
        el.style.height = "";
        el.style.overflow = "";
        el.style.boxSizing = "";
      }
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
    };
  }, [isMobile, value]);

  return (
    <textarea
      ref={ref}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={className}
    />
  );
}