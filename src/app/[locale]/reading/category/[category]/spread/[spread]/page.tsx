import spreadsData from '@/lib/data/spreads.json';
// import { useRouter } from 'next/navigation';
import enTranslations from '@/locales/en/common.json';
import trTranslations from '@/locales/tr/common.json';
import deTranslations from '@/locales/de/common.json';
import esTranslations from '@/locales/es/common.json';
import frTranslations from '@/locales/fr/common.json';
import itTranslations from '@/locales/it/common.json';
import UnveilButton from '@/components/reading/UnveilButton';
import StepperBarClientWrapper from '@/components/reading/StepperBarClientWrapper';

const TRANSLATIONS = {
  en: enTranslations,
  tr: trTranslations,
  de: deTranslations,
  es: esTranslations,
  fr: frTranslations,
  it: itTranslations,
};

export default function Page({ params }: { params: { locale: string, spread: string, category?: string } }) {
  const { locale, spread, category } = params;
  const spreadObj = spreadsData.find((s: any) => s.key === spread);
  if (!spreadObj) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">Spread not found.</div>;
  }
  const translations = TRANSLATIONS[locale] || TRANSLATIONS['en'];
  const steps = [
    { label: translations.reading_step_category, icon: "/images/steps/category_icon.png", desc: translations.reading_step_desc_category, keyword: translations.category_general_label },
    { label: translations.reading_step_spread, icon: "/images/steps/spread_icon.png", desc: translations.reading_step_desc_spread, keyword: translations.spread_singleCard_title },
    { label: translations.reading_step_cards, icon: "/images/steps/cards_icon.png", desc: translations.reading_step_desc_cards, keyword: translations.reading_choose_cards },
  ];
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 w-full">
      <div className="w-full max-w-3xl mx-auto">
        <StepperBarClientWrapper
          step={1}
          steps={steps}
          categorySelected={!!category}
          category={category}
          locale={locale}
          spread={spread}
        />
      </div>
      <img src={spreadObj.image} alt={spreadObj.label} className="mb-4 w-full max-w-md rounded shadow" />
      <h2 className="text-2xl font-bold mb-2 text-accent-gold drop-shadow-lg">{spreadObj.label}</h2>
      <p className="text-base text-gray-700 text-center mb-6 max-w-xl">{spreadObj.desc}</p>
      <UnveilButton
        locale={locale}
        spread={spread}
        label={translations.reading_unveil_button || 'Unveil the Stars'}
      />
    </div>
  );
} 