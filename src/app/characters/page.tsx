"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Item = {
  name: string;
  image: string;
  path: string;
  hoverText: string;
};

export default function CharactersPage() {
  const router = useRouter();

  const categories = [
    {
      title: "Trending characters :",
      justify: "justify-center",
      items: [
        { name: "Santa", image: "/characters/santa.webp", path: "/characters/santa", hoverText: "Ho-ho-ho! Merry AI-mas!" },
        { name: "Alien", image: "/characters/alien.webp", path: "/characters/alien", hoverText: "Greetings, Earthling." },
        { name: "Navy Seal", image: "/characters/navyseal.webp", path: "/characters/navyseal", hoverText: "Ready for action." },
        { name: "Monk", image: "/characters/monk.webp", path: "/characters/monk", hoverText: "Peace and wisdom." },
        { name: "Tribal Man", image: "/characters/tribalman.webp", path: "/characters/tribal-man", hoverText: "Ancient voices speak." },
      ],
    },
    {
      title: "Cultural theme :",
      justify: "justify-start",
      items: [
        { name: "Monk", image: "/characters/monk.webp", path: "/characters/monk", hoverText: "Peace and wisdom." },
        { name: "Tribal Man", image: "/characters/tribalman.webp", path: "/characters/tribal-man", hoverText: "Ancient voices speak." },
      ],
    },
  ];

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>, path: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(path);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-(--space-3) py-(--space-5)">
      {/* Header */}
      <div className="flex flex-col items-center pt-(--space-1) mb-[calc(var(--space-4)*0.9)]">
        <span className="text-gray-150 text-(length:--font-size-md) sm:text-[1rem] font-semibold mb-[0.1rem]">
          Step <span className="text-[#7c3aed] font-bold">1</span> of 2
        </span>
        <h1 className="text-(length:--font-size-xl) sm:text-(length:--font-size-xxl) font-bold text-[#7c3aed] leading-[1.05] tracking-[-0.03em]">
          Choose your <span className="gradient-title">character</span>
        </h1>
      </div>

      {/* Character sections */}
      <div className="mt-(--space-6) flex flex-col gap-(--space-6) w-full max-w-6xl">
        {categories.map((category, i) => (
          <section key={i} className="flex flex-col items-start w-full">
            <h2 className="text-[18px] font-bold text-gray-150 mb-6 ml-5">
              {category.title}
            </h2>
            <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 ${category.justify} gap-(--space-2) w-full justify-items-center`}>
              {category.items.map((item) => (
                <CharacterCard
                  key={item.path}
                  item={item}
                  onSelect={() => router.push(item.path)}
                  onKey={(e) => handleKey(e, item.path)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

/* ---------------------------------- */
/*  single card with hover swap       */
/* ---------------------------------- */
function CharacterCard({
  item,
  onSelect,
  onKey,
}: {
  item: Item;
  onSelect: () => void;
  onKey: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      role="button"
      aria-label={`Choose ${item.name} character`}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={onKey}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="character-card cursor-pointer"
    >
      <div className="character-card__shine"></div>
      <div className="character-card__glow"></div>
      <div className="character-card__content">
        <div className="character-card__image">
          <Image src={item.image} alt={`${item.name} preview`} width={400} height={500} loading="lazy" />
        </div>
        <div className="character-card__text">
          <p className="character-card__title">{item.name}</p>
          <p className="character-card__description">
            {hover ? item.hoverText : "AI character greeting"}
          </p>
        </div>
      </div>
    </div>
  );
}