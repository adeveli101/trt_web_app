import React from "react";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";

const categoryImages = [
  "general_category_image.png",
  "love_category_image.png",
  "career_category_image.png",
  "spiritual_category_image.png",
  "health_category_image.png",
  "custom_category_image.png",
];

const stepImages = [
  "category_icon.png",
  "spread_icon.png",
  "cards_icon.png",
  "result_icon.png",
];

export default function HowItWorksSection() {
  const t = useTranslations('common');
  const stepKeys = [
    'homepage_howitworks_step_1',
    'homepage_howitworks_step_2',
    'homepage_howitworks_step_3',
    'homepage_howitworks_step_4',
  ];
  const steps = stepKeys.map((key) => t(key));
  return (
    <section id="how-it-works" className="relative py-12 md:py-16 min-h-[60vh] md:min-h-[70vh] bg-gradient-to-b from-transparent to-[var(--bg-color)] flex flex-col items-center px-4 md:px-8">
      <div className="max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, type: "spring" }}
          className="flex justify-center text-center"
        >
          <SectionHeading className="text-center">
            {t('homepage_howitworks_title')}
          </SectionHeading>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
          className="text-base md:text-lg font-cabin text-[var(--text-muted-color)] mb-8 text-center leading-relaxed transition duration-200 hover:scale-105"
        >
          {t('homepage_howitworks_desc')}
        </motion.p>
        <div className="h-1 w-24 bg-gradient-to-r from-black via-[#1a103b] to-[#3a0a1a] mx-auto mt-2 mb-12 rounded animate-fade-in"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.12, duration: 0.7, type: "spring" }}
              className="bg-[var(--card-bg-color)] border-l-4 border-[var(--accent-color)] p-6 md:p-8 shadow-2xl rounded-xl flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-[var(--accent-color)]/20 transition-all duration-300"
            >
              <div className="w-full flex items-center justify-center mb-4 overflow-hidden">
                <img
                  src={`/images/steps/${stepImages[i % stepImages.length]}`}
                  alt="How it works step"
                  className="object-contain w-full h-auto max-w-[90%] max-h-[180px] md:max-h-[220px] rounded-xl shadow-md bg-black/10 animate-fade-in transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  aria-hidden
                />
              </div>
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
                className="text-base md:text-lg font-cabin text-[var(--text-muted-color)] text-center leading-relaxed transition duration-200 hover:scale-105"
              >
                {typeof step === 'string' ? step.replace(/^\d+\.\s*/, '') : ''}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 