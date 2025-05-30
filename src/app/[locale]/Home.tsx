"use client";
import React, { useEffect, useRef, useState } from "react";
import IntroSection from "@/components/sections/IntroSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import CategoryGridSection from "@/components/sections/CategoryGridSection";
import PopularSpreadsSection from "@/components/sections/PopularSpreadsSection";
import AboutSection from "@/components/sections/AboutSection";
import FeaturesSection from "@/components/sections/FeaturesSection";

export default function Home() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);

  // Animasyon class'ları
  const sectionBase =
    "transition-all duration-700 ease-out min-h-screen flex flex-col justify-center py-12 md:py-20 px-4 md:px-6 text-center scroll-mt-[var(--navbar-height-mobile)] md:scroll-mt-[var(--navbar-height)]";
  const sectionAnim = (visible: boolean) =>
    `${sectionBase} ${visible ? "opacity-100 translate-y-0 scale-100 shadow-2xl ring-2 ring-[var(--accent-color)] ring-opacity-40" : "opacity-0 translate-y-10 scale-95 blur-sm"}`;

  // Intersection Observer ile görünürlük kontrolü
  useEffect(() => {
    const handleIntersection = (
      ref: React.RefObject<HTMLDivElement | null>,
      setVisible: (v: boolean) => void
    ) => {
      if (!ref.current) return;
      const observer = new window.IntersectionObserver(
        ([entry]) => {
          setVisible(entry.isIntersecting && entry.intersectionRatio > 0.18);
        },
        { threshold: [0, 0.18, 0.55, 1] }
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    };
    const cleanupAbout = handleIntersection(aboutRef, setAboutVisible);
    const cleanupFeatures = handleIntersection(featuresRef, setFeaturesVisible);
    return () => {
      cleanupAbout && cleanupAbout();
      cleanupFeatures && cleanupFeatures();
    };
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[var(--bg-color)] pb-24 flex flex-col">
      <main>
        <IntroSection />
        <HowItWorksSection />
        <CategoryGridSection />
        <PopularSpreadsSection />
        <div ref={aboutRef}>
          <AboutSection visible={aboutVisible} sectionClass={sectionAnim(aboutVisible)} />
        </div>
        <div ref={featuresRef}>
          <FeaturesSection visible={featuresVisible} sectionClass={sectionAnim(featuresVisible)} />
        </div>
      </main>
    </div>
  );
} 