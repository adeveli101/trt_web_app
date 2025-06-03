// app/reading/page.tsx
import ReadingPage from './ReadingPage';
import spreadsData from '@/lib/data/spreads.json';
import categoriesData from '@/lib/data/categories.json';
import { promises as fs } from 'fs';
import path from 'path';

async function loadTranslations(locale: string) {
  const filePath = path.join(process.cwd(), 'src', 'locales', locale, 'common.json');
  const file = await fs.readFile(filePath, 'utf8');
  return JSON.parse(file);
}

export async function generateMetadata({ params }: { params: { locale: string } }) {
  // Sadece fallback başlık ve açıklama döndür
  return {
    title: 'Reading | Astral Tarot',
    description: 'Tarot reading page.'
  };
}

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const translations = await loadTranslations(locale);
  const steps = [
    {
      label: translations.reading_step_category,
      desc: translations.reading_step_desc_category,
      icon: "/images/steps/category_icon.png",
      keyword: translations.category_general_label
    },
    {
      label: translations.reading_step_spread,
      desc: translations.reading_step_desc_spread,
      icon: "/images/steps/spread_icon.png",
      keyword: translations.spread_singleCard_title
    },
    {
      label: translations.reading_step_cards,
      desc: translations.reading_step_desc_cards,
      icon: "/images/steps/cards_icon.png",
      keyword: translations.reading_choose_cards
    },
    {
      label: translations.reading_step_result,
      desc: translations.reading_step_desc_result,
      icon: "/images/steps/result_icon.png",
      keyword: translations.reading_result_keyword
    }
  ];
  return (
    <div className="w-full flex-1 flex flex-col justify-center px-0">
      <ReadingPage
        locale={locale}
        translations={translations}
        error={null}
        steps={steps}
      />
    </div>
  );
}