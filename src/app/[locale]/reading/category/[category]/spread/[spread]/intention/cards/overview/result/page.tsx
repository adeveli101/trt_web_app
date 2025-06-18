import { promises as fs } from 'fs';
import path from 'path';
import ReadingResultClientWrapper from '@/components/reading/ReadingResultClientWrapper';

async function loadTranslations(locale: string) {
  const filePath = path.join(process.cwd(), 'src', 'locales', locale, 'common.json');
  const file = await fs.readFile(filePath, 'utf8');
  return JSON.parse(file);
}

export default async function Page({ params }: { params: Promise<{ locale: string, category: string, spread: string }> }) {
  const { locale, category, spread } = await params;
  const translations = await loadTranslations(locale);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#2a1746] via-[#3a1053] to-[var(--bg-color)] w-full">
      <ReadingResultClientWrapper
        locale={locale}
        category={category}
        spread={spread}
        translations={translations}
      />
    </div>
  );
} 