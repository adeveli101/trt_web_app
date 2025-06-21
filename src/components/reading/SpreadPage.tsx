"use client";
import React from "react";
import ReadingStepper from "./ReadingStepper";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";

export default function SpreadPage({ spread, locale, spreadsData }: { spread: string, locale: string, spreadsData: any[] }) {
  const t = useTranslations();
  const spreadObj = spreadsData.find((s: any) => s.key === spread);
  if (!spreadObj) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">{t('spread_not_found')}</div>;
  }
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[var(--bg-color)] py-12 md:py-20 px-2 md:px-8">
      {/* Kozmik yıldız SVG/noise overlay (landing'deki gibi) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/images/bg_stars.svg')] bg-repeat opacity-60" />
        <div className="absolute inset-0 bg-[url('/images/noise.png')] bg-repeat opacity-20" />
      </div>
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center justify-center">
        <SectionHeading className="mb-6 mt-2 text-accent-gold drop-shadow-lg text-center" font="cinzel">
          {t(`spread_${spread}_title`)}
        </SectionHeading>
        <img src={`/images/spreads/${spread}.png`} alt={t(`spread_${spread}_title`)} className="mb-6 w-full max-w-md rounded-xl shadow border border-[var(--accent-color)] bg-[#1a0026]" />
        <p className="mb-8 text-lg text-gray-300 max-w-2xl text-center font-cabin">{t(`spread_${spread}_desc`)}</p>
        {/* Burada spread'e özel bir kart seçimi başlatılabilir */}
        <div className="w-full max-w-3xl mx-auto flex-1">
          <ReadingStepper steps={[]} translations={t} />
        </div>
      </div>
    </section>
  );
} 