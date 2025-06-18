"use client";
import React from "react";
import { useTranslations } from "next-intl";
import spreadsData from "@/lib/data/spreads.json";
import { spreadCategoryMap } from "@/lib/data/spreadCategoryMap";
import CosmicBackground from "@/components/layout/CosmicBackground";

export default function CategoryPage({ category, locale, categoriesData, onSelect }: { category: string, locale: string, categoriesData: any[], onSelect?: (spreadKey: string) => void }) {
  const t = useTranslations('common');
  const categoryObj = categoriesData.find((cat: any) => cat.key === category);
  if (!categoryObj) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">{t('category_not_found') || 'Category not found.'}</div>;
  }

  // İlgili kategoriye ait spreadleri filtrele (yeni dizi tabanlı map ile)
  const filteredSpreads = spreadsData.filter((spread: any) => spreadCategoryMap[categoryObj.key]?.includes(spread.key));

  return (
    <div className="min-h-screen flex flex-col items-center bg-[var(--bg-color)] w-full">
      <CosmicBackground />
      <h1 className="text-3xl font-bold mt-8 mb-4 text-accent-gold drop-shadow-lg">{t(`category_${categoryObj.key}_label`) || categoryObj.label}</h1>
      <p className="mb-8 text-lg text-gray-700 max-w-2xl text-center">{t(`reading_category_insight_${categoryObj.key}`) || categoryObj.insight}</p>
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-x-0 gap-y-10 mt-4 px-2 sm:px-4 justify-items-center">
        {filteredSpreads.map((spread: any, idx: number) => {
          let desc = t(`spread_${spread.key}_desc`) || spread.desc;
          if (desc && desc.length > 80) {
            const dotIdx = desc.indexOf(".");
            desc = dotIdx > 0 ? desc.slice(0, dotIdx + 1) : desc.slice(0, 80) + "...";
          }
          // Eğer tek kart kalıyorsa ortala
          const isLastOdd = filteredSpreads.length % 2 === 1 && idx === filteredSpreads.length - 1;
          return (
            <div
              key={spread.key}
              className={isLastOdd ? "sm:col-span-2 flex justify-center" : ""}
            >
              <button
                className="flex flex-col items-center rounded-2xl overflow-hidden shadow-lg border border-[var(--accent-color)] group focus:outline-none p-0 bg-gradient-to-br from-[#180026] via-[#3B006A] to-[#7A2062] min-h-[220px] h-full w-full max-w-[420px] snap-center relative transition-all duration-300 hover:border-accent-gold hover:shadow-2xl"
                style={{ fontFamily: 'Cabin, Cinzel Decorative, sans-serif' }}
                onClick={() => onSelect && onSelect(spread.key)}
              >
                <div className="w-full aspect-[16/7] min-h-[180px] relative bg-[#1a0026]">
                  <img
                    src={spread.image}
                    alt={t(`spread_${spread.key}_title`) || spread.label}
                    className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-accent-gold group-hover:shadow-gold transition-all duration-300 z-10" />
                </div>
                <div className="w-full flex flex-col items-start px-4 py-3">
                  <h2 className="text-xl xl:text-2xl font-bold text-accent-gold mb-1" style={{ fontFamily: 'Cinzel Decorative, serif' }}>{t(`spread_${spread.key}_title`) || spread.label}</h2>
                  <span className="text-sm xl:text-base text-gray-300 text-left leading-snug" style={{ fontFamily: 'Cabin, sans-serif' }}>{desc}</span>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
} 