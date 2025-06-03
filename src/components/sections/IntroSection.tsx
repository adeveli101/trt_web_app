import React from "react";
import { useTranslations } from 'next-intl';
import StartJourneyButton from "../ui/StartJourneyButton";
import { motion } from "framer-motion";

export default function IntroSection({ howItWorksVisible }: { howItWorksVisible?: boolean }) {
  const t = useTranslations('common');
  return (
    <>
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 py-0 md:py-8 bg-gradient-to-br from-[var(--primary-color)] via-[#3a1053] to-[var(--bg-color)] overflow-hidden">
        {/* Animasyonlu arka plan efektleri (ör. yıldızlar, gradient blur) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="z-10 flex flex-col items-center justify-center w-full"
        >
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring" }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 text-center drop-shadow-lg tracking-wide animate-fade-in transition duration-200 hover:scale-105"
            style={{ fontFamily: 'Cinzel Decorative, Lora, serif' }}
          >
            {t('homepage_intro_title')}
          </motion.h1>
          <div className="h-1 w-20 bg-gradient-to-r from-[var(--secondary-color)] to-[var(--accent-color)] mx-auto mt-2 mb-8 rounded animate-fade-in"></div>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
            className="text-lg sm:text-xl md:text-2xl text-[var(--text-muted-color)] mb-8 max-w-2xl text-center animate-fade-in transition duration-200 hover:scale-105"
            style={{ fontFamily: 'Cabin, Lora, serif' }}
          >
            {t('homepage_intro_desc')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, type: "spring" }}
          >
            <StartJourneyButton
              href={`/reading`}
              className="text-lg px-8 py-4 shadow-xl animate-fade-in bg-gradient-to-r from-[#1a103b] via-[#3a1053] to-[#5e3ca4] border-[#2a1746]"
            >
              {t('start_journey')}
            </StartJourneyButton>
          </motion.div>
        </motion.div>
        {/* Scroll down animasyonu */}
        {!howItWorksVisible && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 bottom-8 flex flex-col items-center z-20"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <span className="text-xs text-[var(--text-muted-color)] mb-1">{t('homepage_howitworks_title')}</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent-color)] animate-bounce">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        )}
        {/* Yıldız/blur efektleri için opsiyonel ek divler eklenebilir */}
      </section>
    </>
  );
} 