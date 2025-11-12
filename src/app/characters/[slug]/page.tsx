"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import PaymentSection from "@/components/Payment/PaymentSection";
import VideoPreview from "@/components/VideoPreview";
import AutoResizeTextarea from "@/components/AutoResizeTextarea";
import FAQ from "@/components/FAQ";

export default function CharacterDetailPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const characters = [
    {
      name: "Santa Claus",
      slug: "santa",
      image: "/characters/santa.webp",
      preview: {
        desktop: "/videos/santa-preview.mp4",
        mobile: "/videos/alien-preview.mp4",
      },
    },
    { name: "Alien", slug: "alien", image: "/characters/alien.webp", preview: "/videos/alien-preview.mp4" },
    { name: "Monk", slug: "monk", image: "/characters/monk.webp", preview: "/videos/monk-preview.mp4" },
    { name: "Tribal Man", slug: "tribal-man", image: "/characters/tribalman.webp", preview: "/videos/tribalman-preview.mp4" },
  ];

  const character = characters.find((c) => c.slug === slug) || characters[0];

  const handleGenerate = () => {
    if (!message) return alert("Please write a message first!");
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Generated video for: ${character.name} with message "${message}"`);
    }, 1800);
  };

  const faqItems = [
    {
      q: "What will I actually get?",
      a: "Our AI creates a short video where your chosen character speaks your message - like a personalized greeting.",
    },
    {
      q: "Do I need to pay before seeing the video?",
      a: "Yes - since each video is custom-made, payment is required before generation. The process is quick and secure.",
    },
    {
      q: "Will I be able to download or share it?",
      a: "Yes - you'll get a download link and can share it anywhere you like.",
    },
  ];

  return (
    <main className="flex flex-col items-center justify-start min-h-screen text-center px-(--space-3) py-(--space-5) bg-(--color-background) text-(--color-foreground)">
      <header className="relative w-full max-w-6xl mb-[calc(var(--space-4)*0.9)]">
        <div className="absolute left-0 -top-5 hidden sm:flex">
          <button
            onClick={() => router.push("/characters")}
            title="Go back"
            className="flex items-center gap-2 px-(--space-2) py-(--space-1) rounded-xl bg-[#111] hover:bg-[#1a1a1a] transition-colors duration-(--duration-medium) ease-(--ease-golden) text-(length:--font-size-sm) cursor-pointer"
          >
            ← Go back
          </button>
        </div>

        <div className="flex flex-col items-center pt-(--space-1)">
          <span className="text-gray-400 text-(length:--font-size-md) sm:text-[1rem] font-semibold mb-[0.1rem]">
            Step <span className="text-(--color-gold) font-bold">2</span> of 2
          </span>
          <h1 className="text-(length:--font-size-xl) sm:text-(length:--font-size-xxl) font-bold text-(--color-gold) leading-[1.05]">
            Generate video
          </h1>
        </div>
      </header>

      <section className="flex flex-col lg:flex-row w-full max-w-[950px] items-start justify-center gap-6 px-(--space-3) py-(--space-3) mx-auto transition-all duration-(--duration-medium)">
        <div className="flex flex-col items-center justify-center text-center gap-(--space-2) w-full lg:w-[42%]">
          <div className="relative aspect-9/16 w-full max-w-[400px] lg:w-[260px] rounded-2xl overflow-hidden bg-[#111] flex items-center justify-center shadow-md mx-auto">
            <VideoPreview preview={character.preview} poster={character.image} className="relative aspect-9/16 w-full h-full" />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center lg:items-start gap-(--space-2) w-full lg:w-[45%] max-w-[400px] mx-auto">
          <label className="text-(length:--font-size-md) font-medium text-gray-200 self-start">Type your message here:</label>

          <div className="relative w-full mb-0">
            <AutoResizeTextarea
              id="message"
              value={message}
              onChange={setMessage}
              placeholder="Hey John, I wish you a happy birthday! Have another wonderful year. Much love!"
              maxLength={100}
              className="w-full h-auto lg:h-32 bg-[#111] text-white placeholder-gray-500 p-(--space-2) rounded-xl resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-gold) hover:bg-[#151515] leading-relaxed transition-all duration-50 pr-10 align-top mb-0"
            />
            <span className="pointer-events-none absolute bottom-1.5 right-3 text-gray-500 text-xs leading-none">{message.length}/100</span>
          </div>

          <button
            disabled={!message || isGenerating}
            onClick={handleGenerate}
            className={
              "w-full bg-(--color-gold) text-black font-semibold rounded-xl py-(--space-1) mt-(--space-1) " +
              "transition-colors duration-(--duration-medium) ease-(--ease-golden) hover:brightness-95 " +
              "relative z-10 pointer-events-auto cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            }
          >
            {isGenerating ? "Generating..." : "Generate video"}
          </button>

          <div className="mt-(--space-1) w-full">
            <FAQ items={faqItems} />
          </div>
        </div>
      </section>

      {showPayment && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPayment(false);
          }}
        >
          <div
            className="bg-[#111] rounded-2xl shadow-lg p-(--space-3) w-[90%] max-w-md text-center border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
          <h2 className="text-[32px] font-semibold text-(--color-gold) leading-[1.05]">
            Complete your payment
          </h2>

          <p className="text-gray-400 mt-4">
            Choose a secure payment method
          </p>

          <div className="text-center mt-4">
            <span className="block font-bold text-[3rem] text-white leading-tight">
              $3.99
            </span>
            <span className="text-gray-400 text-[1rem]">per video</span>
          </div>

            <PaymentSection onSuccess={handlePaymentSuccess} />
            <button
              onClick={() => setShowPayment(false)}
              className="mt-(--space-2) text-gray-400 hover:text-white text-(length:--font-size-sm) transition-colors duration-(--duration-medium)"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <section className="mt-(--space-5) w-full max-w-6xl">
        <h3 className="text-(length:--font-size-md) font-semibold text-(--color-gold) mb-(--space-2)">Other Christmas characters:</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-(--space-2) justify-items-center">
          {characters
            .filter((c) => c.slug !== slug)
            .map((c, index) => (
              <div key={index} onClick={() => router.push(`/characters/${c.slug}`)} className="cursor-pointer group aspect-3/4 w-[120px] sm:w-[150px] rounded-2xl overflow-hidden bg-[#111] hover:-translate-y-0.5 transition-transform duration-(--duration-medium) ease-(--ease-golden)">
                <Image src={c.image} alt={`${c.name} preview`} width={200} height={260} className="w-full h-full object-cover rounded-2xl group-hover:scale-[1.05] transition-transform duration-(--duration-medium)" />
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}