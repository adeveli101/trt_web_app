import CardSelectionClientWrapper from '@/components/reading/CardSelectionClientWrapper';
import StepperBarClientDynamicWrapper from '@/components/reading/StepperBarClientDynamicWrapper';
import CosmicBackground from '@/components/layout/CosmicBackground';
import { promises as fs } from 'fs';
import path from 'path';
import CardSelectionClientWrapperClient from './CardSelectionClientWrapperClient';

// Spread bilgisini JSON'dan yükle
async function loadSpreadInfo(spreadKey: string) {
  const filePath = path.join(process.cwd(), 'src', 'lib', 'data', 'spreads.json');
  const file = await fs.readFile(filePath, 'utf8');
  const spreads = JSON.parse(file);
  // spreadKey ile eşleşen spread'i bul
  return spreads.find((s: any) => s.key === spreadKey);
}

async function loadTranslations(locale: string) {
  const filePath = path.join(process.cwd(), 'src', 'locales', locale, 'common.json');
  const file = await fs.readFile(filePath, 'utf8');
  return JSON.parse(file);
}

export default async function Page({ params }: { params: Promise<{ locale: string, category: string, spread: string }> }) {
  const { locale, category, spread } = await params;
  const translations = await loadTranslations(locale);
  const spreadInfo = await loadSpreadInfo(spread);

  if (!spreadInfo) {
    return <div style={{ color: 'red', padding: 32 }}>Spread not found: <b>{spread}</b></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#2a1746] via-[#3a1053] to-[var(--bg-color)] w-full relative overflow-x-hidden">
      <CosmicBackground />
      <div className="sticky top-0 z-40 w-full">
        <StepperBarClientDynamicWrapper
          categorySelected={!!category}
          category={category}
          locale={locale}
          spread={spreadInfo.key}
        />
      </div>
      <CardSelectionClientWrapperClient
        spreadCardCount={spreadInfo.cardCount}
        label={spreadInfo.label}
        positionDescription={spreadInfo.desc}
        cardSize={spreadInfo.cardCount === 1 ? 'lg' : 'sm'}
        translations={translations}
        spreadKey={spreadInfo.key}
        image={spreadInfo.image}
        desc={spreadInfo.desc}
        locale={locale}
        category={category}
        spread={spreadInfo.key}
      />
    </div>
  );
} 