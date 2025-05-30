import React from "react";
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";

const icons = [
  // Emoji veya SVG ikonlar (isteğe göre değiştirilebilir)
  "💫", "🃏", "✨", "🔮"
];

export default function HowItWorksSection() {
  const { t } = useTranslation('common');
  const stepsRaw = t('homepage_howitworks_steps', { returnObjects: true });
  const steps = Array.isArray(stepsRaw) ? stepsRaw : [];
  return (
    <section id="how-it-works" className="relative py-16 md:py-24 bg-gradient-to-b from-transparent to-[var(--bg-color)] flex flex-col items-center">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, type: "spring" }}
        className="text-3xl md:text-4xl font-extrabold text-white mb-8 text-center drop-shadow-lg tracking-wide animate-fade-in"
        style={{ fontFamily: 'Cinzel Decorative, Lora, serif' }}
      >
        {t('homepage_howitworks_title')}
      </motion.h2>
      <div className="h-1 w-20 bg-gradient-to-r from-[var(--secondary-color)] to-[var(--accent-color)] mx-auto mt-2 mb-8 rounded animate-fade-in"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full max-w-5xl px-2 md:px-8">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.15, duration: 0.7, type: "spring" }}
            className="flex flex-col items-center bg-gradient-to-br from-[#2a1746]/80 to-[var(--primary-color)]/80 rounded-2xl shadow-xl p-6 md:p-8 min-h-[180px] group hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            <span className="text-4xl md:text-5xl mb-4 drop-shadow-lg animate-fade-in" aria-hidden>{icons[i % icons.length]}</span>
            <span className="text-lg md:text-xl font-bold text-white mb-2 text-center" style={{ fontFamily: 'Cabin, Lora, serif' }}>Step {i + 1}</span>
            <span className="text-base text-[var(--text-muted-color)] text-center" style={{ fontFamily: 'Cabin, Lora, serif' }}>{step.replace(/^\d+\.\s*/, '')}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
} 