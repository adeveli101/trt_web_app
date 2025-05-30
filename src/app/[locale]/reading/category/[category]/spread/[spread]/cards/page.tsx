import ReadingStepper from '@/components/reading/ReadingStepper';
import spreadsData from '@/lib/data/spreads.json';
import enTranslations from '@/locales/en/common.json';
import trTranslations from '@/locales/tr/common.json';
import deTranslations from '@/locales/de/common.json';
import esTranslations from '@/locales/es/common.json';
import frTranslations from '@/locales/fr/common.json';
import itTranslations from '@/locales/it/common.json';
import StepperBarClientWrapper from '@/components/reading/StepperBarClientWrapper';

const TRANSLATIONS = {
  en: enTranslations,
  tr: trTranslations,
  de: deTranslations,
  es: esTranslations,
  fr: frTranslations,
  it: itTranslations,
};

export default async function Page({ params }: { params: { locale: string, spread: string, category: string } }) {
  const awaitedParams = await params;
  const { locale, spread, category } = awaitedParams;
  const translations = TRANSLATIONS[locale] || TRANSLATIONS['en'];
  const spreadObj = spreadsData.find((s: any) => s.key === spread);
  if (!spreadObj) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">Spread not found.</div>;
  }
  // steps prop'unu spread veya category'ye göre oluşturabilirsin, örnek olarak:
  const steps = [
    { label: translations.reading_step_category, icon: "/images/steps/category_icon.png", desc: translations.reading_step_desc_category, keyword: translations.category_general_label },
    { label: translations.reading_step_spread, icon: "/images/steps/spread_icon.png", desc: translations.reading_step_desc_spread, keyword: translations.spread_singleCard_title },
    { label: translations.reading_step_cards, icon: "/images/steps/cards_icon.png", desc: translations.reading_step_desc_cards, keyword: translations.reading_choose_cards },
    { label: translations.reading_step_result || 'Sonuç', icon: "/images/steps/result_icon.png", desc: translations.reading_step_desc_result || 'AI Tarot Sonucu', keyword: translations.reading_result_keyword || 'Sonuç' },
  ];
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 w-full">
      <div className="w-full max-w-3xl mx-auto">
        <StepperBarClientWrapper
          step={3}
          steps={steps}
          categorySelected={!!category}
          category={category}
          locale={locale}
          spread={spread}
        />
      </div>
      <ReadingStepper initialCategory={category} steps={steps} translations={translations} showStepperBar={false} />
    </div>
  );
} 