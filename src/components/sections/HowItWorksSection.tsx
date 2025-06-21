import React from "react";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";

const stepImages = [
  "steps/category_icon.png",
  "steps/spread_icon.png",
  "steps/intention_icon.png",
  "steps/cards_icon.png",
  "steps/overview_icon.png",
  "cardsRevealing.gif",
];

export default function HowItWorksSection() {
  const t = useTranslations();
  const stepKeys = [
    'homepage_howitworks_step_1',
    'homepage_howitworks_step_2',
    'homepage_howitworks_step_3',
    'homepage_howitworks_step_4',
    'homepage_howitworks_step_5',
    'homepage_howitworks_step_6',
  ];
  const steps = stepKeys.map((key) => t(key));
  const finalStep = steps[steps.length - 1];
  const finalStepImage = stepImages[stepImages.length - 1];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 w-full">
          {steps.slice(0, 5).map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.12, duration: 0.7, type: "spring" }}
              className="bg-[var(--card-bg-color)] border-l-4 border-[var(--accent-color)] p-6 md:p-8 shadow-2xl rounded-xl flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-[var(--accent-color)]/20 transition-all duration-300 h-full"
            >
              <div className="w-full flex items-center justify-center mb-4 overflow-hidden flex-grow">
                <img
                  src={`/images/${stepImages[i]}`}
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

        <div className="flex justify-center my-8 animate-pulse">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--accent-color)]">
              <path d="M12 4V20M12 20L16 16M12 20L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>

        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 50 }}
            className="bg-gradient-to-br from-[var(--accent-color)]/10 via-transparent to-transparent border-2 border-[var(--accent-color)] p-8 shadow-[0_0_40px_-10px_var(--accent-color)] rounded-2xl flex flex-col md:flex-row items-center text-center md:text-left w-full max-w-3xl mx-auto hover:shadow-[0_0_50px_-10px_var(--accent-color)] transition-shadow duration-500"
        >
            <div className="w-full md:w-1/2 flex items-center justify-center mb-6 md:mb-0 md:mr-8 overflow-hidden">
                <img
                    src={`/images/${finalStepImage}`}
                    alt="Final Step"
                    className="object-cover w-full h-auto rounded-xl shadow-2xl bg-black/20"
                    loading="lazy"
                />
            </div>
            <div className="w-full md:w-1/2">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
                  className="text-2xl md:text-3xl font-bold text-white mb-3"
                >
                  {t('homepage_howitworks_step_6_title').replace(/^\d+\.\s*/, '')}
                </motion.h3>
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.6, type: "spring" }}
                    className="text-base md:text-lg font-cabin text-[var(--text-muted-color)] leading-relaxed"
                >
                    {typeof finalStep === 'string' ? finalStep.replace(/^\d+\.\s*/, '') : ''}
                </motion.span>
            </div>
        </motion.div>
      </div>
    </section>
  );
} 