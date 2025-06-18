import { promises as fs } from 'fs';
import path from 'path';
import React from 'react';
import ReadingResultClientWrapper from '@/components/reading/ReadingResultClientWrapper';

async function loadTranslations(locale: string) {
  const filePath = path.join(process.cwd(), 'src', 'locales', locale, 'common.json');
  const file = await fs.readFile(filePath, 'utf8');
  return JSON.parse(file);
}

export default async function ResultPage({ params }: { params: Promise<{ locale: string, category: string, spread: string }> }) {
  const { locale, category, spread } = await params;
  const translations = await loadTranslations(locale);

  return (
    <ReadingResultClientWrapper
      locale={locale}
      category={category}
      spread={spread}
      translations={translations}
    />
  );
} 