"use client";

import { useEffect, useState } from "react";

export default function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handle = () =>
      setIsMobile(typeof window !== "undefined" ? window.innerWidth < breakpoint : false);
    handle();
    window.addEventListener("resize", handle);
    window.addEventListener("orientationchange", handle);
    return () => {
      window.removeEventListener("resize", handle);
      window.removeEventListener("orientationchange", handle);
    };
  }, [breakpoint]);

  return isMobile;
}