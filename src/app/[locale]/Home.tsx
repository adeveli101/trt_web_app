// src/app/[locale]/Home.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import IntroSection from "@/components/sections/IntroSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import CategoryGridSection from "@/components/sections/CategoryGridSection";
import PopularSpreadsSection from "@/components/sections/PopularSpreadsSection";
import AboutSection from "@/components/sections/AboutSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import { Separator } from "@/components/ui/separator";
import SectionWrapper from "@/components/layout/SectionWrapper";

export default function Home() {
  // Animasyon class'ları ve diğer statik tanımlamalar
  const sectionBase =
    "transition-all duration-700 ease-out min-h-screen flex flex-col justify-center py-12 md:py-20 px-4 md:px-6 text-center scroll-mt-[var(--navbar-height-mobile)] md:scroll-mt-[var(--navbar-height)]";

  // HowItWorksSection görünürlüğü için state ve ref
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const [howItWorksVisible, setHowItWorksVisible] = useState(false);

  useEffect(() => {
    if (!howItWorksRef.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setHowItWorksVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    observer.observe(howItWorksRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-[100dvh] relative pb-24 flex flex-col bg-gradient-to-br from-[var(--primary-color)] via-[#1A0833] to-[var(--bg-color)] overflow-hidden">
      {/* Kozmik yıldızlar SVG/deseni */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="star-glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" stopOpacity="0.8" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Yıldızlar */}
        <circle cx="200" cy="200" r="1.5" fill="#fff" />
        <circle cx="400" cy="800" r="1.2" fill="#fff" />
        <circle cx="1200" cy="300" r="1.8" fill="#fff" />
        <circle cx="1700" cy="900" r="1.3" fill="#fff" />
        <circle cx="900" cy="600" r="2.2" fill="url(#star-glow)" />
        <circle cx="1500" cy="200" r="1.1" fill="#fff" />
        <circle cx="300" cy="1000" r="1.7" fill="#fff" />
        <circle cx="1800" cy="400" r="1.4" fill="#fff" />
        {/* Daha fazla yıldız eklenebilir */}
      </svg>
      {/* Hafif nebula/texture efekti (örnek PNG) */}
      <img src="/images/nebula_overlay.png" alt="nebula" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0" />
      {/* Hafif noise efekti (örnek PNG) */}
      <img src="/images/noise.png" alt="noise" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0" />
      <main>
        <IntroSection howItWorksVisible={howItWorksVisible} />
        <SectionWrapper ref={howItWorksRef}>
          <HowItWorksSection />
        </SectionWrapper>
        <SectionWrapper>
          <CategoryGridSection />
        </SectionWrapper>
        <SectionWrapper>
          <PopularSpreadsSection />
        </SectionWrapper>
        <SectionWrapper minHeight="min-h-[80vh] md:min-h-[90vh]">
          <AboutSection sectionClass={sectionBase} />
        </SectionWrapper>
        <SectionWrapper minHeight="min-h-[80vh] md:min-h-[90vh]" showSeparator={false}>
          <FeaturesSection sectionClass={sectionBase} />
        </SectionWrapper>
      </main>
    </div>
  );
}