"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="flex flex-col items-center justify-center text-center px-6 pt-28 pb-16">
      {/* Main Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-4xl sm:text-6xl font-semibold leading-tight max-w-3xl"
      >
        Generate{" "}
        <span className="text-(--color-gold)">personalized</span> AI greetings
        in seconds.
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        className="mt-6 text-lg sm:text-xl text-gray-300 max-w-xl"
      >
        Turn simple messages into lasting memories.
      </motion.p>

      {/* CTA Button — only entrance animation, no hover scaling */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        onClick={() => router.push("/characters")}
        className="mt-10 px-8 py-4 rounded-full bg-(--color-gold) text-black font-medium text-lg
                   focus:outline-none cursor-pointer transition-all duration-300 ease-out
                   hover:bg-[#d4e500] hover:shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
      >
        Create your first video
      </motion.button>
    </section>
  );
}
