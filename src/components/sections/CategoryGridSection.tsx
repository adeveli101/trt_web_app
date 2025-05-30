import React from "react";
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";

const categories = [
  { key: "general", icon: "🌌" },
  { key: "love", icon: "💖" },
  { key: "career", icon: "💼" },
  { key: "spiritual", icon: "🧘‍♂️" },
  { key: "health", icon: "🌱" },
  { key: "custom", icon: "✨" },
];

export default function CategoryGridSection() {
  const { t } = useTranslation('common');
  return (
    <section id="categories" className="relative py-16 md:py-24 bg-gradient-to-b from-transparent to-[var(--bg-color)] flex flex-col items-center">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, type: "spring" }}
        className="text-3xl md:text-4xl font-extrabold text-white mb-8 text-center drop-shadow-lg tracking-wide animate-fade-in"
        style={{ fontFamily: 'Cinzel Decorative, Lora, serif' }}
      >
        {t('features_title')}
      </motion.h2>
      <div className="h-1 w-20 bg-gradient-to-r from-[var(--secondary-color)] to-[var(--accent-color)] mx-auto mt-2 mb-8 rounded animate-fade-in"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl px-2 md:px-8">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.key}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.12, duration: 0.7, type: "spring" }}
            className="flex flex-col items-center bg-gradient-to-br from-[#2a1746]/80 to-[var(--primary-color)]/80 rounded-2xl shadow-xl p-7 md:p-8 min-h-[200px] group hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer"
          >
            <div className="w-full aspect-[16/7] min-h-[100px] flex items-center justify-center mb-4">
              <img
                src={`/images/categories/${cat.key}_category_image.png`}
                alt={t(`category_${cat.key}_label`)}
                className="object-contain w-full h-full rounded-xl shadow-md bg-black/10 animate-fade-in"
                loading="lazy"
              />
            </div>
            <span className="text-lg md:text-xl font-bold text-white mb-2 text-center" style={{ fontFamily: 'Cabin, Lora, serif' }}>{t(`category_${cat.key}_label`)}</span>
            <span className="text-base text-[var(--text-muted-color)] text-center" style={{ fontFamily: 'Cabin, Lora, serif' }}>{t(`category_${cat.key}_desc`)}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
} 