"use client";

import { motion } from "framer-motion";

export default function VideoShowcase() {
  const videos = ["/videos/sample1.mp4", "/videos/sample2.mp4", "/videos/sample3.mp4"];

  return (
    <section className="flex flex-col items-center justify-center pb-28">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl w-full px-6">
        {videos.map((src, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.25,
              duration: 0.9,
              ease: [0.25, 0.1, 0.25, 1], // smooth cubic-bezier curve
            }}
            className="rounded-3xl border-2 border-(--color-gold) overflow-hidden shadow-[0_0_25px_rgba(229,255,0,0.05)]"
          >
            <video
              src={src}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover aspect-9/16"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
