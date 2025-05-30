"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomeClient() {
  const router = useRouter();
  useEffect(() => {
    // Tarayıcı dilini bul, desteklenmiyorsa 'en' kullan
    const supported = ["en", "tr", "de", "fr", "es", "it"];
    let locale = "en";
    if (typeof window !== "undefined") {
      const navLang = navigator.language?.slice(0,2);
      if (navLang && supported.includes(navLang)) locale = navLang;
    }
    setTimeout(() => {
      router.push(`/${locale}`);
    }, 1500);
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-950 to-black text-white">
      <h1 className="text-5xl font-extrabold mb-4 mt-12 tracking-widest animate-pulse drop-shadow-lg">Astral Tarot</h1>
      <p className="text-lg mb-8 opacity-80">Your cosmic journey is starting...</p>
    </main>
  );
} 