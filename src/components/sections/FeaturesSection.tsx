import React from "react";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";

interface FeaturesSectionProps {
  sectionClass: string;
}

export default function FeaturesSection({ sectionClass }: FeaturesSectionProps) {
  const t = useTranslations('common');
  const cardAnim = (visible: boolean) =>
    `transition-all duration-700 ease-out opacity-100 translate-y-0 scale-100`;

  const features = [
    { title: t('feature_1_title'), desc: t('feature_1_desc') },
    { title: t('feature_2_title'), desc: t('feature_2_desc') },
    { title: t('feature_3_title'), desc: t('feature_3_desc') },
  ];

  return (
    <section id="features" className={sectionClass}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          <SectionHeading>
            {t('features_title')}
          </SectionHeading>
        </motion.div>
        <div className="h-1 w-20 bg-gradient-to-r from-black via-[#1a103b] to-[#3a0a1a] mx-auto mt-2 mb-12 rounded animate-fade-in"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto justify-center">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + index * 0.15, duration: 0.7, type: "spring" }}
              className={`bg-[var(--card-bg-color)] p-6 rounded-xl shadow-2xl border-l-4 border-[var(--secondary-color)] text-left hover:-translate-y-2 hover:shadow-[var(--accent-color)]/20 w-full md:w-[22rem] ${features.length % 2 === 1 && index === features.length - 1 ? 'md:col-span-2 md:mx-auto' : ''}`}
            >
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 drop-shadow transition duration-700 animate-fade-in transition duration-200 hover:scale-105" style={{ fontFamily: 'Cinzel Decorative, serif' }}>{feature.title}</h3>
              <p className="text-sm text-[var(--text-muted-color)] leading-relaxed transition duration-200 hover:scale-105">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 