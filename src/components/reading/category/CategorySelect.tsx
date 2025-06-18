"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";

interface Category {
  key: string;
  label: string;
  insight: string;
  image: string;
  isPopular?: boolean;
  isPremium?: boolean;
  isNew?: boolean;
}

export default function CategorySelect({ onSelect, onBack }: { onSelect: (category: string) => void, onBack?: () => void }) {
  const t = useTranslations('common');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    import("@/lib/data/categories.json").then((mod) => {
      setCategories(mod.default || mod);
    });
  }, []);

  return (
    <section className="relative w-full min-h-[60vh] md:min-h-[80vh] flex flex-col items-center justify-center py-12 md:py-20 px-2 md:px-8 bg-transparent">
      {/* Kozmik yıldız SVG/noise overlay (landing'deki gibi) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/images/bg_stars.svg')] bg-repeat opacity-60" />
        <div className="absolute inset-0 bg-[url('/images/noise.png')] bg-repeat opacity-20" />
      </div>
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        <SectionHeading className="mb-8 text-accent-gold drop-shadow-lg">
          {t('reading_choose_category')}
        </SectionHeading>
        <div className="mb-6 w-full px-0 md:px-8 mx-auto">
          <div className="bg-gradient-to-r from-[#180026] via-[#3B006A] to-[#7A2062] text-white text-sm md:text-base rounded-lg px-4 py-3 shadow-md text-center animate-fade-in font-cabin">
            {t('reading_category_info')}
          </div>
        </div>
        {/* Responsive grid: mobilde yatay scroll, md+ grid-cols-2, xl+ grid-cols-3 */}
        <div className="w-full">
          <div className="w-full overflow-x-auto pb-2 md:hidden">
            <div className="flex w-max gap-6 snap-x snap-mandatory px-2 sm:px-6">
              {categories.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="min-h-[220px] h-full min-w-[200px] w-[80vw] max-w-[260px] rounded-2xl bg-gradient-to-br from-[#180026] via-[#3B006A] to-[#7A2062]" />
                ))
              ) : (
                categories.map((cat) => (
                  <motion.button
                    key={cat.key}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    whileHover={{
                      scale: 1.04,
                      boxShadow: "0 8px 32px 0 #FFD70044",
                      borderColor: "#FFD700",
                      background: "linear-gradient(120deg, #180026 0%, #3B006A 50%, #7A2062 100%)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect(cat.key)}
                    aria-label={t(`category_${cat.key}_label`) || cat.label}
                    className={`flex flex-col items-center rounded-2xl overflow-hidden shadow-lg border border-[var(--accent-color)] group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold p-0 bg-gradient-to-br from-[#180026] via-[#3B006A] to-[#7A2062] min-h-[220px] h-full min-w-[200px] w-[80vw] max-w-[260px] snap-center relative transition-all duration-300 hover:border-accent-gold hover:shadow-2xl font-cabin`}
                    style={{ fontFamily: 'Cabin, Cinzel Decorative, sans-serif' }}
                  >
                    <div className="w-full aspect-[16/7] min-h-[180px] relative bg-[#1a0026]">
                      <img
                        src={cat.image}
                        alt={t(`category_${cat.key}_label`) || cat.label}
                        className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-accent-gold group-hover:shadow-gold transition-all duration-300 z-10" />
                    </div>
                    <div className="w-full flex flex-col items-start px-4 py-3">
                      <h2 className="text-xl xl:text-2xl font-bold text-accent-gold mb-1" style={{ fontFamily: 'Cinzel Decorative, serif' }}>{t(`category_${cat.key}_label`) || cat.label}</h2>
                      <span className="text-sm xl:text-base text-gray-300 text-left leading-snug" style={{ fontFamily: 'Cabin, sans-serif' }}>{t(`reading_category_insight_${cat.key}`) || cat.insight}</span>
                    </div>
                    <div className="w-full flex justify-center pb-2">
                      <svg width="90%" height="8" viewBox="0 0 180 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 4 Q 90 12 170 4 Q 90 8 10 4 Z" fill="url(#cat-separator-gradient)" />
                        <defs>
                          <linearGradient id="cat-separator-gradient" x1="0" y1="4" x2="180" y2="4" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#1a0008" stopOpacity="0.1" />
                            <stop offset="0.25" stopColor="#2c0018" stopOpacity="0.7" />
                            <stop offset="0.5" stopColor="#6a003a" stopOpacity="1" />
                            <stop offset="0.75" stopColor="#2c0018" stopOpacity="0.7" />
                            <stop offset="1" stopColor="#1a0008" stopOpacity="0.1" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    {cat.isPopular && (
                      <div className="absolute top-2 left-2 z-30">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400/90 shadow minimal-gold-glow">
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" className="text-yellow-600"><path d="M10 15.27L16.18 18l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 3.73L3.82 18z" /></svg>
                        </span>
                      </div>
                    )}
                  </motion.button>
                ))
              )}
            </div>
          </div>
          {/* md+ grid görünümü */}
          <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 gap-8 w-full">
            {categories.length === 0 ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="min-h-[220px] h-full w-full rounded-2xl bg-gradient-to-br from-[#180026] via-[#3B006A] to-[#7A2062]" />
              ))
            ) : (
              categories.map((cat) => (
                <motion.button
                  key={cat.key}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0 8px 32px 0 #FFD70044",
                    borderColor: "#FFD700",
                    background: "linear-gradient(120deg, #180026 0%, #3B006A 50%, #7A2062 100%)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(cat.key)}
                  aria-label={t(`category_${cat.key}_label`) || cat.label}
                  className={`flex flex-col items-center rounded-2xl overflow-hidden shadow-lg border border-[var(--accent-color)] group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold p-0 bg-gradient-to-br from-[#180026] via-[#3B006A] to-[#7A2062] min-h-[220px] h-full w-full snap-center relative transition-all duration-300 hover:border-accent-gold hover:shadow-2xl font-cabin`}
                  style={{ fontFamily: 'Cabin, Cinzel Decorative, sans-serif' }}
                >
                  <div className="w-full aspect-[16/7] min-h-[180px] relative bg-[#1a0026]">
                    <img
                      src={cat.image}
                      alt={t(`category_${cat.key}_label`) || cat.label}
                      className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-accent-gold group-hover:shadow-gold transition-all duration-300 z-10" />
                  </div>
                  <div className="w-full flex flex-col items-start px-4 py-3">
                    <h2 className="text-xl xl:text-2xl font-bold text-accent-gold mb-1" style={{ fontFamily: 'Cinzel Decorative, serif' }}>{t(`category_${cat.key}_label`) || cat.label}</h2>
                    <span className="text-sm xl:text-base text-gray-300 text-left leading-snug" style={{ fontFamily: 'Cabin, sans-serif' }}>{t(`reading_category_insight_${cat.key}`) || cat.insight}</span>
                  </div>
                  <div className="w-full flex justify-center pb-2">
                    <svg width="90%" height="8" viewBox="0 0 180 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 4 Q 90 12 170 4 Q 90 8 10 4 Z" fill="url(#cat-separator-gradient)" />
                      <defs>
                        <linearGradient id="cat-separator-gradient" x1="0" y1="4" x2="180" y2="4" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#1a0008" stopOpacity="0.1" />
                          <stop offset="0.25" stopColor="#2c0018" stopOpacity="0.7" />
                          <stop offset="0.5" stopColor="#6a003a" stopOpacity="1" />
                          <stop offset="0.75" stopColor="#2c0018" stopOpacity="0.7" />
                          <stop offset="1" stopColor="#1a0008" stopOpacity="0.1" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  {cat.isPopular && (
                    <div className="absolute top-2 left-2 z-30">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400/90 shadow minimal-gold-glow">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" className="text-yellow-600"><path d="M10 15.27L16.18 18l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 3.73L3.82 18z" /></svg>
                      </span>
                    </div>
                  )}
                </motion.button>
              ))
            )}
          </div>
        </div>
        <div className="mt-8 text-sm xl:text-base text-muted-foreground w-full px-8 text-center font-cabin">
          <p>{t('reading_category_footer')}</p>
        </div>
        {onBack && (
          <button onClick={onBack} className="mt-6 text-accent-gold underline font-cabin focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold">
            {t('reading_back_button')}
          </button>
        )}
      </div>
    </section>
  );
} 