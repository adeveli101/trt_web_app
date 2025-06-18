import { promises as fs } from 'fs';
import path from 'path';
// import ReadingResultClientWrapper from '@/src/components/reading/ReadingResultClientWrapper';

async function loadTranslations(locale: string) {
  const filePath = path.join(process.cwd(), 'src', 'locales', locale, 'common.json');
  const file = await fs.readFile(filePath, 'utf8');
  return JSON.parse(file);
}

export default async function Page({ params }: { params: Promise<{ locale: string, category: string, spread: string }> }) {
  const { locale, category, spread } = await params;
  const translations = await loadTranslations(locale);

  // İleride ReadingResultClientWrapper ile kullanılacak
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#2a1746] via-[#3a1053] to-[var(--bg-color)] w-full">
      <h1 className="text-3xl md:text-4xl font-bold text-accent-gold mb-6 text-center">{translations.reading_step_result || 'Tarot Sonucu'}</h1>
      {/* <ReadingResultClientWrapper locale={locale} category={category} spread={spread} translations={translations} /> */}
      <div className="text-lg text-white/80 text-center max-w-xl">
        Burada AI ile kişiselleştirilmiş tarot okuma sonucu ve detaylı analiz gösterilecek.
      </div>
    </div>
  );
} 