import React from "react";
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";

interface FeaturesSectionProps {
  visible: boolean;
  sectionClass: string;
}

export default function FeaturesSection({ visible, sectionClass }: FeaturesSectionProps) {
  const { t } = useTranslation('common');
  const cardAnim = (visible: boolean) =>
    `transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 blur-sm"}`;

  const features = [
    { title: t('feature_1_title'), desc: t('feature_1_desc') },
    { title: t('feature_2_title'), desc: t('feature_2_desc') },
    { title: t('feature_3_title'), desc: t('feature_3_desc') },
  ];

  return (
    <section id="features" className={sectionClass}>
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring" }}
          className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6 relative inline-block drop-shadow-lg transition duration-700 animate-fade-in"
          style={{ fontFamily: 'Cinzel Decorative, Lora, serif' }}
        >
          {t('features_title')}
        </motion.h2>
        <div className="h-1 w-20 bg-gradient-to-r from-[var(--secondary-color)] to-[var(--accent-color)] mx-auto mt-2 mb-12 rounded animate-fade-in"></div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + index * 0.15, duration: 0.7, type: "spring" }}
              className={`bg-[var(--card-bg-color)] p-6 rounded-xl shadow-2xl border-l-4 border-[var(--secondary-color)] text-left hover:-translate-y-2 hover:shadow-[var(--accent-color)]/20`}
            >
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 drop-shadow transition duration-700 animate-fade-in" style={{ fontFamily: 'Cinzel Decorative, Lora, serif' }}>{feature.title}</h3>
              <p className="text-sm text-[var(--text-muted-color)] leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 