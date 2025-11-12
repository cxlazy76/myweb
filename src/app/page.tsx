import Hero from "../components/Hero";
import VideoShowcase from "../components/VideoShowcase";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-(--color-background) text-(--color-foreground) font-sans">
      <Hero />
      <VideoShowcase />
    </main>
  );
}