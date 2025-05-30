import React from "react";
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";

const spreads = [
  { key: "singleCard" },
  { key: "pastPresentFuture" },
  { key: "celticCross" },
  { key: "relationshipSpread" },
];

export default function PopularSpreadsSection() {
  const { t } = useTranslation('common');
  return (
    <section id="popular-spreads" className="relative py-16 md:py-24 bg-gradient-to-b from-transparent to-[var(--bg-color)] flex flex-col items-center">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, type: "spring" }}
        className="text-3xl md:text-4xl font-extrabold text-white mb-4 text-center drop-shadow-lg tracking-wide animate-fade-in"
        style={{ fontFamily: 'Cinzel Decorative, Lora, serif' }}
      >
        {t('homepage_spreads_title')}
      </motion.h2>
      <div className="h-1 w-20 bg-gradient-to-r from-[var(--secondary-color)] to-[var(--accent-color)] mx-auto mt-2 mb-8 rounded animate-fade-in"></div>
      <p className="text-lg text-[var(--text-muted-color)] mb-10 text-center max-w-2xl animate-fade-in" style={{ fontFamily: 'Cabin, Lora, serif' }}>
        {t('homepage_spreads_desc')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-6xl px-2 md:px-8">
        {spreads.map((spread, i) => (
          <motion.div
            key={spread.key}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.12, duration: 0.7, type: "spring" }}
            className="flex flex-col items-center bg-gradient-to-br from-[#2a1746]/80 to-[var(--primary-color)]/80 rounded-2xl shadow-xl p-6 md:p-8 min-h-[240px] group hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer"
          >
            <div className="w-full aspect-[19/9] flex items-center justify-center mb-4">
              <img
                src={`/images/spreads/${spread.key}.png`}
                alt={t(`spread_${spread.key}_title`)}
                className="w-full h-full object-contain rounded-xl shadow-md bg-black/10"
                loading="lazy"
              />
            </div>
            <span className="text-lg md:text-xl font-bold text-white mb-2 text-center" style={{ fontFamily: 'Cabin, Lora, serif' }}>{t(`spread_${spread.key}_title`)}</span>
            <span className="text-base text-[var(--text-muted-color)] text-center" style={{ fontFamily: 'Cabin, Lora, serif' }}>{t(`spread_${spread.key}_desc`)}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
} 