// app/reading/page.tsx
import ReadingPage from './ReadingPage';

const LOCALE_MAP = {
  en: () => import('@/locales/en/common.json'),
  tr: () => import('@/locales/tr/common.json'),
  de: () => import('@/locales/de/common.json'),
  es: () => import('@/locales/es/common.json'),
  fr: () => import('@/locales/fr/common.json'),
  it: () => import('@/locales/it/common.json'),
};

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const awaitedParams = await params;
  const { locale } = awaitedParams;
  let translations: any = {};
  try {
    translations = (await (LOCALE_MAP[locale] ? LOCALE_MAP[locale]() : LOCALE_MAP['en']())).default;
  } catch {
    try {
      translations = (await LOCALE_MAP['en']()).default;
    } catch {
      // fallback boş bırakılır
    }
  }
  return {
    title: translations?.meta_title || 'Reading | Astral Tarot',
    description: translations?.meta_description || 'Tarot reading page.'
  };
}

export default async function Page({ params }: { params: { locale: string } }) {
  const awaitedParams = await params;
  const { locale } = awaitedParams;
  let translations: any = {};
  let error: string | null = null;
  try {
    translations = (await (LOCALE_MAP[locale] ? LOCALE_MAP[locale]() : LOCALE_MAP['en']())).default;
  } catch {
    try {
      translations = (await LOCALE_MAP['en']()).default;
      error = `Translation for locale '${locale}' not found. Showing English.`;
    } catch {
      error = 'Translation files could not be loaded.';
    }
  }
  // StepperBar için çeviri değerlerini hazırla
  const steps = [
    { label: translations.reading_step_category, icon: "/images/steps/category_icon.png", desc: translations.reading_step_desc_category, keyword: translations.category_general_label },
    { label: translations.reading_step_spread, icon: "/images/steps/spread_icon.png", desc: translations.reading_step_desc_spread, keyword: translations.spread_singleCard_title },
    { label: translations.reading_step_cards, icon: "/images/steps/cards_icon.png", desc: translations.reading_step_desc_cards, keyword: translations.reading_choose_cards },
  ];
  return <ReadingPage locale={locale} translations={translations} error={error} steps={steps} />;
}