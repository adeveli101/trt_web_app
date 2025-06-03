import React from "react";
import StartJourneyButton from "../ui/StartJourneyButton";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";

export default function AboutSection({ sectionClass }: { sectionClass: string }) {
  const t = useTranslations('common');
  return (
    <section id="about" className={sectionClass}>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          <SectionHeading>
            {t('about_title')}
          </SectionHeading>
        </motion.div>
        <div className="h-1 w-20 bg-gradient-to-r from-black via-[#1a103b] to-[#3a0a1a] mx-auto mt-2 mb-8 rounded animate-fade-in"></div>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
          className="text-lg text-[var(--text-muted-color)] mb-8 transition duration-200 hover:scale-105"
        >
          {t('about_desc')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.7, type: "spring" }}
        >
          <StartJourneyButton href={`/reading`}>
            {t('start_journey')}
          </StartJourneyButton>
        </motion.div>
      </div>
    </section>
  );
} 