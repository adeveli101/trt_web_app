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
      label: translations.reading_step_prompt,
      desc: translations.reading_step_desc_prompt,
      icon: "/images/steps/intention_icon.png",
      keyword: translations.reading_step_prompt
    },
    {
      label: translations.reading_step_cards,
      desc: translations.reading_step_desc_cards,
      icon: "/images/steps/cards_icon.png",
      keyword: translations.reading_choose_cards
    },
    {
      label: translations.reading_step_overview,
      desc: translations.reading_step_desc_overview,
      icon: "/images/steps/overview_icon.png"
    }
  ];
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-[#2a1746] via-[#3a1053] to-[var(--bg-color)] overflow-x-hidden">
      {/* Kozmik yıldız SVG ve noise overlay landing'deki gibi buraya eklenebilir */}
      <ReadingPage
        locale={locale}
        translations={translations}
        error={null}
        steps={steps}
      />
    </div>
  );
}