import React from "react";
import StartJourneyButton from "../ui/StartJourneyButton";
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import { motion } from "framer-motion";

export default function AboutSection({ visible, sectionClass }: { visible: boolean, sectionClass: string }) {
  const { t } = useTranslation('common');
  const params = useParams();
  const locale = params?.locale || 'en';
  return (
    <section id="about" className={sectionClass}>
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring" }}
          className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6 relative inline-block drop-shadow-lg transition duration-700 animate-fade-in"
          style={{ fontFamily: 'Cinzel Decorative, Lora, serif' }}
        >
          {t('about_title')}
        </motion.h2>
        <div className="h-1 w-20 bg-gradient-to-r from-[var(--secondary-color)] to-[var(--accent-color)] mx-auto mt-2 mb-8 rounded animate-fade-in"></div>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
          className="text-lg text-[var(--text-muted-color)] mb-8"
        >
          {t('about_desc')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.7, type: "spring" }}
        >
          <StartJourneyButton href={`/${locale}/reading`}>
            {t('start_journey')}
          </StartJourneyButton>
        </motion.div>
      </div>
    </section>
  );
} 