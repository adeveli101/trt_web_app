"use client";
import React, { useState, useEffect } from 'react';
import StepperBarClientDynamicWrapper from '@/components/reading/StepperBarClientDynamicWrapper';
import CosmicBackground from '@/components/layout/CosmicBackground';
import TarotCardSingle from './TarotCardSingle';
import TarotCardSheet from './TarotCardSheet';
import UnveilButton from './UnveilButton';
import { TarotCard } from '@/lib/tarotTypes';
import { useSwipeable } from 'react-swipeable';
import { spreadPositions, mapSelectedCardsToSpread, getTarotCardImage } from '@/lib/tarotLogic';
import spreadsData from '@/lib/data/spreads.json';
import { useRouter } from "next/navigation";

interface OverviewPageClientWrapperProps {
  locale: string;
  category: string;
  spread: string;
  translations: any;
  cards: TarotCard[];
  spreadObj: any;
}

export default function OverviewPageClientWrapper({ locale, category, spread, translations, cards: initialCards, spreadObj }: OverviewPageClientWrapperProps) {
  const [loading, setLoading] = useState(false);
  const [aiResult, setAIResult] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetCard, setSheetCard] = useState<TarotCard | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [buttonScale, setButtonScale] = useState(1);
  const router = useRouter();

  // Dinamik kartlar: localStorage'dan oku
  useEffect(() => {
    const storageKey = `selectedCards_${spread}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setCards(JSON.parse(stored));
    }
  }, [spread]);

  // Pozisyon başlıklarını spread'e göre al
  const positions = spreadPositions[spread] || cards.map((_, i) => `Card ${i + 1}`);
  // Kartları pozisyonlara eşle
  const spreadMap = positions.reduce((acc, pos, idx) => {
    acc[pos] = cards[idx];
    return acc;
  }, {} as Record<string, TarotCard>);

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY;
      // 0-200px arası scale 1 -> 0.85
      const minScale = 0.85;
      const maxScroll = 200;
      const scale = 1 - Math.min(scrollY, maxScroll) / maxScroll * (1 - minScale);
      setButtonScale(scale);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function generateCardReadings(cards: TarotCard[]) {
    setLoading(true);
    setAIResult(null);
    
    setTimeout(() => {
      const cardReadings = cards.map((card, index) => {
        const position = index === 0 ? 'Past' : index === 1 ? 'Present' : 'Future';
        const readings = [];

        // Kartın adı ve pozisyonu
        readings.push(`${position}: ${card.name}`);

        // Fortune telling
        if (card.fortune_telling && card.fortune_telling.length > 0) {
          readings.push(`\nFortune Telling:\n${card.fortune_telling.join('\n')}`);
        }

        // Meanings
        if (card.meanings) {
          if (card.meanings.light && card.meanings.light.length > 0) {
            readings.push(`\nLight Meanings:\n${card.meanings.light.join('\n')}`);
          }
          if (card.meanings.shadow && card.meanings.shadow.length > 0) {
            readings.push(`\nShadow Meanings:\n${card.meanings.shadow.join('\n')}`);
          }
        }

        // Keywords
        if (card.keywords && card.keywords.length > 0) {
          readings.push(`\nKeywords:\n${card.keywords.join(', ')}`);
        }

        return readings.join('\n');
      }).join('\n\n');
      
      setAIResult(cardReadings);
      setLoading(false);
    }, 500);
  }

  // Sade tek sayfa: loading, buton ve kart kutuları
  // Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center mt-2 animate-pulse">
        <span className="text-accent-gold font-semibold">{translations.reading_loading || 'Loading...'}</span>
      </div>
    );
  }

  // Ana içerik
  return (
    <div className="relative min-h-screen flex flex-col w-full bg-gradient-to-br from-[#2a1746] via-[#3a1053] to-[var(--bg-color)]">
      <CosmicBackground />
      <div className="sticky top-0 z-40 w-full">
        <StepperBarClientDynamicWrapper
          categorySelected={!!category}
          category={category}
          locale={locale}
          spread={spread}
        />
      </div>
      <main className="relative z-10 flex flex-col items-center w-full px-2">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          <div className="mb-6 flex flex-col items-center justify-center gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-accent-gold drop-shadow text-center mb-1" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
              {translations.reading_step_overview}
            </h2>
          </div>
          <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="col-span-full w-full flex justify-center mb-4">
              <h3 className="text-lg md:text-xl font-semibold text-accent-gold text-center" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
                {translations[`spread_${spread}_title`] || spreadObj?.title || spread}
              </h3>
            </div>
            {positions.map((position, index) => {
              const card = spreadMap[position];
              if (!card) return null;
              return (
                <div key={card.name} className="bg-gradient-to-br from-[#2a1746]/90 to-[#3a1053]/90 rounded-xl shadow-lg p-4 border border-accent-gold/20 transition-all duration-200 transform hover:scale-105 hover:shadow-[0_0_16px_2px_rgba(255,215,0,0.4)] hover:border-accent-gold/80 hover:bg-gradient-to-br hover:from-[#3a1053]/95 hover:to-yellow-900/60 cursor-pointer" style={{ willChange: 'transform, box-shadow, border-color, background' }} onClick={() => { setSheetCard(card); setSheetOpen(true); }} tabIndex={0} role="button" aria-label={`Show details for ${card.name}`}> 
                  <div className="flex flex-row items-center gap-3 mb-3">
                    {/* Minik Kart Resmi */}
                    <img
                      src={getTarotCardImage(card)}
                      alt={card.name}
                      className="w-8 h-12 rounded-md border border-accent-gold/40 bg-white object-cover mr-2"
                      draggable={false}
                    />
                    {/* Kart Başlığı ve İsim */}
                    <div className="flex flex-col justify-center">
                      <h3 className="text-lg font-bold text-accent-gold leading-tight" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
                        {position}
                      </h3>
                      <h4 className="text-sm text-white/90 leading-tight">{card.name}</h4>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {card.fortune_telling && card.fortune_telling.length > 0 && (
                      <div className="bg-black/30 rounded-lg p-2">
                        <h5 className="text-accent-gold text-xs font-semibold mb-1">Fortune</h5>
                        <ul className="text-white/80 text-xs leading-relaxed space-y-1">
                          {card.fortune_telling.map((fortune, i) => (
                            <li key={i} className="flex items-start gap-1"><span className="text-accent-gold">★</span><span>{fortune}</span></li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {card.meanings?.light && card.meanings.light.length > 0 && (
                      <div className="bg-black/30 rounded-lg p-2">
                        <h5 className="text-accent-gold text-xs font-semibold mb-1">Light</h5>
                        <ul className="text-white/80 text-xs leading-relaxed space-y-1">
                          {card.meanings.light.map((light, i) => (
                            <li key={i} className="flex items-start gap-1"><span className="text-accent-gold">★</span><span>{light}</span></li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {card.keywords && card.keywords.length > 0 && (
                      <div className="bg-black/30 rounded-lg p-2">
                        <h5 className="text-accent-gold text-xs font-semibold mb-1">Keywords</h5>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {card.keywords.map((keyword, i) => {
                            const chipColors = [
                              'bg-accent-gold/20 text-accent-gold border-accent-gold',
                              'bg-purple-400/20 text-purple-200 border-purple-400',
                              'bg-pink-400/20 text-pink-200 border-pink-400',
                              'bg-blue-400/20 text-blue-200 border-blue-400',
                            ];
                            const color = chipColors[i % chipColors.length];
                            return (
                              <span
                                key={i}
                                className={`px-2 py-0.5 rounded-full border text-xs font-semibold shadow-sm ${color}`}
                              >
                                {keyword}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <TarotCardSheet open={sheetOpen} onOpenChange={setSheetOpen} card={sheetCard} translations={translations} />
        </div>
      </main>
      {/* Alt sabit buton */}
      <div className="fixed bottom-0 left-0 w-full z-50 flex flex-col items-center pointer-events-none">
        <div className="px-2 pt-2 pointer-events-auto" style={{ transform: `scale(${buttonScale})`, transition: 'transform 0.2s cubic-bezier(.4,1.2,.4,1)' }}>
          <UnveilButton label="" onClick={() => router.push(`/${locale}/reading/category/${category}/spread/${spread}/intention/cards/overview/result`)} />
        </div>
        <div className="w-full flex justify-center pb-4 pointer-events-auto">
          <span className="text-xs md:text-sm text-accent-gold bg-black/40 rounded-xl px-3 py-1 mt-1 text-center max-w-xs shadow-lg normal-case font-sans">
            {translations.reading_step_desc_result}
          </span>
        </div>
      </div>
    </div>
  );
} 