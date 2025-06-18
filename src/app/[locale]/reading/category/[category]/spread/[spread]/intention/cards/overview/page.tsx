import { promises as fs } from 'fs';
import path from 'path';
import React from 'react';
import OverviewPageClientWrapper from '@/components/reading/OverviewPageClientWrapper';
import spreadsData from '@/lib/data/spreads.json';

async function loadTranslations(locale: string) {
  const filePath = path.join(process.cwd(), 'src', 'locales', locale, 'common.json');
  const file = await fs.readFile(filePath, 'utf8');
  return JSON.parse(file);
}

export default async function OverviewPage({ params }: { params: Promise<{ locale: string, category: string, spread: string }> }) {
  const { locale, category, spread } = await params;
  const translations = await loadTranslations(locale);

  // Spread bilgisini spreads.json'dan dinamik olarak al
  const spreadObj = (spreadsData as Record<string, any>)[spread] || {
    label: spread,
    desc: '',
    image: '',
  };

  return (
    <OverviewPageClientWrapper
      locale={locale}
      category={category}
      spread={spread}
      translations={translations}
      cards={[]}
      spreadObj={spreadObj}
    />
  );
} 