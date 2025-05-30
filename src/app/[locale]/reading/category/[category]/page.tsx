import CategoryPage from '@/components/reading/CategoryPage';
import categoriesData from '@/lib/data/categories.json';
import enTranslations from '@/locales/en/common.json';
import trTranslations from '@/locales/tr/common.json';
import deTranslations from '@/locales/de/common.json';
import esTranslations from '@/locales/es/common.json';
import frTranslations from '@/locales/fr/common.json';
import itTranslations from '@/locales/it/common.json';

const TRANSLATIONS = {
  en: enTranslations,
  tr: trTranslations,
  de: deTranslations,
  es: esTranslations,
  fr: frTranslations,
  it: itTranslations,
};

// Next.js 13+ için generateMetadata fonksiyonu ekliyorum
export async function generateMetadata(props: { params: { locale: string, category: string } }) {
  const params = await props.params;
  const category = params.category;
  const locale = params.locale;
  const categoryObj = categoriesData.find((cat: any) => cat.key === category);
  if (!categoryObj) {
    return {
      title: 'Category not found | Astral Tarot',
      description: 'Requested category could not be found.'
    };
  }
  return {
    title: `${categoryObj.label} Tarot | Astral Tarot`,
    description: categoryObj.insight
  };
}

export default async function Page(props: { params: { locale: string, category: string } }) {
  const params = await props.params;
  const category = params.category;
  const locale = params.locale;
  const categoryObj = categoriesData.find((cat: any) => cat.key === category);
  if (!categoryObj) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">Category not found.</div>;
  }
  const translations = TRANSLATIONS[locale] || TRANSLATIONS['en'];
  const steps = [
    { label: translations.reading_step_category, icon: "/images/steps/category_icon.png", desc: translations.reading_step_desc_category, keyword: translations.category_general_label },
    { label: translations.reading_step_spread, icon: "/images/steps/spread_icon.png", desc: translations.reading_step_desc_spread, keyword: translations.spread_singleCard_title },
    { label: translations.reading_step_cards, icon: "/images/steps/cards_icon.png", desc: translations.reading_step_desc_cards, keyword: translations.reading_choose_cards },
  ];
  return (
    <CategoryPage category={categoryObj.key} locale={locale} steps={steps} translations={translations} categoriesData={categoriesData} />
  );
} 