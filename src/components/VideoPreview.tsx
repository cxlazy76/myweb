"use client";

import { useEffect, useRef, useState } from "react";
import useIsMobile from "@/hooks/useIsMobile";

type Preview = string | { desktop: string; mobile: string };

export default function VideoPreview({
  preview,
  poster,
  className,
  maxIconSize = 72,
}: {
  preview: Preview;
  poster?: string;
  className?: string;
  maxIconSize?: number;
}) {
  const isMobile = useIsMobile();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const isHoveringIconRef = useRef(false);
  const hideTimeoutRef = useRef<number | null>(null);

  const src = typeof preview === "object" ? (isMobile ? preview.mobile : preview.desktop) : preview;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.src = src;

    const onPlay = () => {
      setIsPlaying(true);
      // ensure controls hide on mobile immediately when playback starts
      if (isMobile) setShowControls(false);
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      try {
        v.pause();
        v.currentTime = 0;
        v.loop = false;
        v.load();
      } catch {}
      setIsPlaying(false);
    };

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);

    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, [src, isMobile]);

  // extra safety: when playback starts on mobile, ensure controls are hidden
  useEffect(() => {
    if (isMobile && isPlaying) {
      setShowControls(false);
    }
  }, [isMobile, isPlaying]);

  const clearHide = () => {
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const scheduleHide = (delay = 1000) => {
    clearHide();
    hideTimeoutRef.current = window.setTimeout(() => {
      if (isHoveringIconRef.current) return;
      setShowControls(false);
      hideTimeoutRef.current = null;
    }, delay);
  };

  const toggle = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (v.paused) {
        // hide controls on mobile immediately when user taps play
        if (isMobile) setShowControls(false);
        v.loop = false;
        await v.play();
        setIsPlaying(true);
      } else {
        v.pause();
        setIsPlaying(false);
        // show play icon again after pausing so user can resume on mobile
        if (isMobile) setShowControls(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      className={`${className ?? ""} relative`}
      onMouseMove={() => {
        clearHide();
        setShowControls(true);
        scheduleHide(1000);
      }}
      onMouseLeave={() => scheduleHide(1000)}
    >
      <video
        ref={videoRef}
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        // allow tapping the video area to toggle play/pause on mobile
        onClick={toggle}
      />
      <div
        className={`absolute inset-0 z-10 flex items-center justify-center transition-all duration-300 ease-out ${
          (showControls || (!isPlaying && !isMobile)) ? "opacity-80" : "opacity-0"
        }`}
        aria-hidden={!showControls && (isPlaying || isMobile)}
        // hide completely on mobile while playing (prevents accidental clicks)
        style={isMobile && isPlaying ? { display: "none" } : undefined}
      >
        <img
          src={isMobile ? "/other/play-button.svg" : isPlaying ? "/other/pause.svg" : "/other/play-button.svg"}
          alt={isMobile ? "Play preview" : isPlaying ? "Pause video" : "Play preview"}
          onClick={toggle}
          onMouseEnter={() => {
            isHoveringIconRef.current = true;
            clearHide();
            setShowControls(true);
          }}
          onMouseLeave={() => {
            isHoveringIconRef.current = false;
            scheduleHide(1000);
          }}
          role="button"
          tabIndex={0}
          style={{ width: `${maxIconSize}px`, height: `${maxIconSize}px` }}
          className={`transform transition-transform duration-200 ease-out hover:scale-110 hover:opacity-100 ${
            !isMobile ? "cursor-pointer" : "cursor-default"
          }`}
        />
      </div>
    </div>
  );
}