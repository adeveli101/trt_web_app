import React from "react";
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('common');
  return (
    <>
      <section id="categories" className="relative py-16 md:py-24 bg-gradient-to-b from-transparent to-[var(--bg-color)] flex flex-col items-center">
        <div className="max-w-3xl mx-auto w-full">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring" }}
            className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6 relative inline-block drop-shadow-lg transition duration-700 animate-fade-in"
            style={{ fontFamily: 'Cinzel Decorative, serif' }}
          >
            {t('features_title')}
          </motion.h2>
          <div className="h-1 w-20 bg-gradient-to-r from-black via-[#1a103b] to-[#3a0a1a] mx-auto mt-2 mb-8 rounded animate-fade-in"></div>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
            className="text-base md:text-lg font-cabin text-[var(--text-muted-color)] mb-8 text-center leading-relaxed transition duration-200 hover:scale-105"
          >
            {t('features_desc')}
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.12, duration: 0.7, type: "spring" }}
                className="bg-[var(--card-bg-color)] border-l-4 border-[var(--accent-color)] p-6 md:p-8 shadow-2xl rounded-xl flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-[var(--accent-color)]/20 transition-all duration-300"
              >
                <div className="w-full aspect-[16/7] min-h-[100px] flex items-center justify-center mb-4">
                  <img
                    src={`/images/categories/${cat.key}_category_image.png`}
                    alt={t(`category_${cat.key}_label`)}
                    className="object-contain w-full h-full rounded-xl shadow-md bg-black/10 animate-fade-in"
                    loading="lazy"
                  />
                </div>
                <motion.span
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
                  className="text-lg md:text-xl font-cinzel font-bold text-white mb-2 text-center transition duration-200 hover:scale-105"
                >
                  {t(`category_${cat.key}_label`)}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                  className="text-base md:text-lg font-cabin text-[var(--text-muted-color)] text-center leading-relaxed transition duration-200 hover:scale-105"
                >
                  {t(`category_${cat.key}_desc`)}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
} 