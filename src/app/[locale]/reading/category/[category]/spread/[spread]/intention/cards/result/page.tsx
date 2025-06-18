import { promises as fs } from 'fs';
import path from 'path';
import React from 'react';
import OverviewPageClientWrapper from '@/components/reading/OverviewPageClientWrapper';
import tarotCardsData from '@/lib/data/tarot_cards_en.json';

async function loadTranslations(locale: string) {
  const filePath = path.join(process.cwd(), 'src', 'locales', locale, 'common.json');
  const file = await fs.readFile(filePath, 'utf8');
  return JSON.parse(file);
}

export default async function OverviewPage({ params }: { params: Promise<{ locale: string, category: string, spread: string }> }) {
  const { locale, category, spread } = await params;
  const translations = await loadTranslations(locale);

  // Placeholder kartlar ve spread bilgisi (gerçek veri entegrasyonu için props veya context kullanılabilir)
  const selectedCardNames = [
    'The Fool',
    'The Magician',
    'The High Priestess',
  ];
  const cards = tarotCardsData.cards.filter((card: any) => selectedCardNames.includes(card.name));
  const spreadObj = {
    label: 'Past-Present-Future',
    desc: 'Classic three-card spread to see your journey across time.',
    image: '/images/spreads/pastPresentFuture.png',
  };

  return (
    <OverviewPageClientWrapper
      locale={locale}
      category={category}
      spread={spread}
      translations={translations}
      cards={cards}
      spreadObj={spreadObj}
    />
  );
} 