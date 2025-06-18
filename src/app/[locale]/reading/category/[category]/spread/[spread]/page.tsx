import spreadsData from '@/lib/data/spreads.json';
import { redirect } from 'next/navigation';
import enTranslations from '@/locales/en/common.json';
import trTranslations from '@/locales/tr/common.json';
import deTranslations from '@/locales/de/common.json';
import esTranslations from '@/locales/es/common.json';
import frTranslations from '@/locales/fr/common.json';
import itTranslations from '@/locales/it/common.json';
import StepperBarClientWrapper from '@/components/reading/StepperBarClientWrapper';

const TRANSLATIONS: Record<string, typeof enTranslations> = {
  en: enTranslations,
  tr: trTranslations,
  de: deTranslations,
  es: esTranslations,
  fr: frTranslations,
  it: itTranslations,
};

export default async function Page({ params }: { params: Promise<{ locale: string, category: string, spread: string }> }) {
  const { locale, category, spread } = await params;
  redirect(`/${locale}/reading/category/${category}/spread/${spread}/intention`);
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string, category: string, spread: string }> }) {
  const { locale, category, spread } = await params;
  const spreadObj = spreadsData.find((s: any) => s.key === spread);
  const translations = TRANSLATIONS[locale] || TRANSLATIONS['en'];
  if (!spreadObj) {
    return {
      title: 'Spread Not Found',
      description: 'The requested spread was not found.',
    };
  }
  const steps = [
    { label: translations.reading_step_category, icon: "/images/steps/category_icon.png", desc: translations.reading_step_desc_category, keyword: translations.category_general_label },
    { label: translations.reading_step_spread, icon: "/images/steps/spread_icon.png", desc: translations.reading_step_desc_spread, keyword: translations.spread_singleCard_title },
    { label: translations.reading_step_prompt, icon: "/images/steps/intention_icon.png", desc: translations.reading_step_desc_prompt, keyword: translations.reading_step_prompt },
    { label: translations.reading_step_cards, icon: "/images/steps/cards_icon.png", desc: translations.reading_step_desc_cards, keyword: translations.reading_choose_cards },
    { label: translations.reading_step_overview || 'Sonuç', icon: "/images/steps/overview_icon.png", desc: translations.reading_step_desc_overview || 'AI Tarot Sonucu' },
  ];

  return {
    title: spreadObj.label,
    description: spreadObj.desc || translations.meta_description,
  };
} 