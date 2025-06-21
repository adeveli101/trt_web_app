import React from "react";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";

const spreads = [
  { key: "singleCard" },
  { key: "pastPresentFuture" },
  { key: "celticCross" },
  { key: "relationshipSpread" },
];

export default function PopularSpreadsSection() {
  const t = useTranslations();
  return (
    <>
      <section id="popular-spreads" className="relative py-16 md:py-24 bg-gradient-to-b from-transparent to-[var(--bg-color)] flex flex-col items-center">
        <div className="max-w-3xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring" }}
            className="flex justify-center text-center"
          >
            <SectionHeading className="text-center">
              {t('homepage_spreads_title')}
            </SectionHeading>
          </motion.div>
          <div className="h-1 w-20 bg-gradient-to-r from-[var(--secondary-color)] to-[var(--accent-color)] mx-auto mt-2 mb-8 rounded animate-fade-in"></div>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
            className="text-base md:text-lg font-cabin text-[var(--text-muted-color)] mb-8 text-center leading-relaxed transition duration-200 hover:scale-105"
          >
            {t('homepage_spreads_desc')}
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {spreads.map((spread, i) => (
              <motion.div
                key={spread.key}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.12, duration: 0.7, type: "spring" }}
                className="bg-[var(--card-bg-color)] border-l-4 border-[var(--accent-color)] p-6 md:p-8 shadow-2xl rounded-xl flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-[var(--accent-color)]/20 transition-all duration-300"
              >
                <div className="w-full aspect-[19/9] flex items-center justify-center mb-4">
                  <img
                    src={`/images/spreads/${spread.key}.png`}
                    alt={t(`spread_${spread.key}_title`)}
                    className="w-full h-full object-contain rounded-xl shadow-md bg-black/10"
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
                  {t(`spread_${spread.key}_title`)}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                  className="text-base md:text-lg font-cabin text-[var(--text-muted-color)] text-center leading-relaxed transition duration-200 hover:scale-105"
                >
                  {t(`spread_${spread.key}_desc`)}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
} 