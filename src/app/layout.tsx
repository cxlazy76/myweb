import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/* Load Inter font and connect to CSS variable */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Greeting Videos",
  description: "Generate personalized AI greetings in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-(--color-background) text-(--color-foreground)">
        {children}
      </body>
    </html>
  );
}
