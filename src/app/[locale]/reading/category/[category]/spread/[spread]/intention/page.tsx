import IntentionPageClientWrapper from '@/components/reading/IntentionPageClientWrapper';
import { promises as fs } from 'fs';
import path from 'path';

async function loadTranslations(locale: string) {
  const filePath = path.join(process.cwd(), 'src', 'locales', locale, 'common.json');
  const file = await fs.readFile(filePath, 'utf8');
  return JSON.parse(file);
}

export default async function Page({ params }: { params: { locale: string, category: string, spread: string } }) {
  const awaitedParams = await params;
  const { locale, category, spread } = awaitedParams;
  const translations = await loadTranslations(locale);
  const steps = [
    { label: translations.reading_step_category, icon: "/images/steps/category_icon.png", desc: translations.reading_step_desc_category, keyword: translations.category_general_label },
    { label: translations.reading_step_spread, icon: "/images/steps/spread_icon.png", desc: translations.reading_step_desc_spread, keyword: translations.spread_singleCard_title },
    { label: translations.reading_step_prompt, icon: "/images/steps/intention_icon.png", desc: translations.reading_step_desc_prompt, keyword: translations.reading_step_prompt },
    { label: translations.reading_step_cards, icon: "/images/steps/cards_icon.png", desc: translations.reading_step_desc_cards, keyword: translations.reading_choose_cards },
    { label: translations.reading_step_overview || 'Sonuç', icon: "/images/steps/overview_icon.png", desc: translations.reading_step_desc_overview || 'AI Tarot Sonucu' },
  ];

  return (
    <IntentionPageClientWrapper
      locale={locale}
      category={category}
      spread={spread}
      translations={translations}
      steps={steps}
    />
  );
} 