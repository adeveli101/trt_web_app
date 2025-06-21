"use client";
import React, { useState, useEffect } from 'react';
import StepperBarClientDynamicWrapper from '@/components/reading/StepperBarClientDynamicWrapper';
import CosmicBackground from '@/components/layout/CosmicBackground';
import TarotCardSingle from './TarotCardSingle';
import TarotCardSheet from './TarotCardSheet';
import UnveilButton from './UnveilButton';
import { TarotCard } from '@/lib/tarotTypes';

import { spreadPositions, mapSelectedCardsToSpread, getTarotCardImage } from '@/lib/tarotLogic';
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
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 justify-items-center">
            <div className="col-span-full w-full flex justify-center mb-6">
              <h3 className="text-lg md:text-xl font-semibold text-accent-gold text-center" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
                {translations[`spread_${spread}_title`] || spreadObj?.title || spread}
              </h3>
            </div>
            {positions.map((position, index) => {
              const card = spreadMap[position];
              if (!card) return null;
              
              // Kart tipine göre bilgileri belirle
              const isMajorArcana = card.arcana === 'major';
              const isMinorArcana = card.arcana === 'minor';
              
              return (
                <div key={card.name} className="group relative w-full max-w-xs bg-gradient-to-br from-[#1a0f2e]/95 to-[#2d1b4e]/95 rounded-2xl shadow-xl border border-accent-gold/30 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_5px_rgba(255,215,0,0.3)] hover:border-accent-gold/60 cursor-pointer overflow-hidden" style={{ willChange: 'transform, box-shadow, border-color' }} onClick={() => { setSheetCard(card); setSheetOpen(true); }} tabIndex={0} role="button" aria-label={`Show details for ${card.name}`}> 
                  {/* Üst kısım - Kart resmi ve başlık */}
                  <div className="relative p-4 pb-2">
                    {/* Arka plan efekti */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/5 to-transparent rounded-t-2xl"></div>
                    
                    {/* Kart resmi ve pozisyon */}
                    <div className="relative flex items-center gap-3 mb-3">
                      <div className="relative">
                        <img
                          src={getTarotCardImage(card)}
                          alt={card.name}
                          className="w-12 h-18 rounded-lg border-2 border-accent-gold/50 bg-white object-cover shadow-lg group-hover:border-accent-gold/80 transition-colors duration-300"
                          draggable={false}
                        />
                        {/* Kart tipi badge */}
                        <div className="absolute -top-1 -right-1">
                          {isMajorArcana ? (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-600/90 text-white border border-purple-400 shadow-sm">
                              MAJOR
                            </span>
                          ) : isMinorArcana && card.suit ? (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600/90 text-white border border-blue-400 shadow-sm">
                              {card.suit.toUpperCase()}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-accent-gold leading-tight mb-1" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
                          {position}
                        </h3>
                        <h4 className="text-xs text-white/90 leading-tight truncate">{card.name}</h4>
                      </div>
                    </div>
                  </div>
                  
                  {/* Alt kısım - Bilgiler */}
                  <div className="px-4 pb-4 space-y-2">
                    {/* Keywords - Kompakt */}
                    {card.keywords && card.keywords.length > 0 && (
                      <div className="bg-black/40 rounded-lg p-2 border border-accent-gold/20">
                        <h5 className="text-accent-gold text-[10px] font-bold mb-1.5 uppercase tracking-wide">Keywords</h5>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {card.keywords.map((keyword, i) => {
                            // Farklı renk kombinasyonları
                            const chipColors = [
                              'bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-200 border-purple-400/50 shadow-sm shadow-purple-500/20',
                              'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-200 border-blue-400/50 shadow-sm shadow-blue-500/20',
                              'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-200 border-green-400/50 shadow-sm shadow-green-500/20',
                              'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-200 border-yellow-400/50 shadow-sm shadow-yellow-500/20',
                              'bg-gradient-to-r from-pink-500/20 to-pink-600/20 text-pink-200 border-pink-400/50 shadow-sm shadow-pink-500/20',
                              'bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 text-indigo-200 border-indigo-400/50 shadow-sm shadow-indigo-500/20',
                              'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-200 border-red-400/50 shadow-sm shadow-red-500/20',
                              'bg-gradient-to-r from-teal-500/20 to-teal-600/20 text-teal-200 border-teal-400/50 shadow-sm shadow-teal-500/20',
                            ];
                            const colorClass = chipColors[i % chipColors.length];
                            
                            return (
                              <span
                                key={i}
                                className={`px-2 py-1 rounded-lg border text-[10px] font-bold tracking-wide transition-all duration-200 hover:scale-105 hover:shadow-lg ${colorClass}`}
                              >
                                {keyword}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Özel bilgiler - Kompakt */}
                    <div className="space-y-1.5">
                      {/* Major Arcana için özel bilgiler */}
                      {isMajorArcana && card.Archetype && (
                        <div className="bg-purple-900/30 rounded-lg p-2 border border-purple-500/30">
                          <h5 className="text-purple-300 text-[10px] font-bold mb-1 uppercase tracking-wide">Archetype</h5>
                          <p className="text-white/80 text-[10px] leading-tight">{card.Archetype}</p>
                        </div>
                      )}
                      
                      {/* Element - Tüm kartlar için */}
                      {card.Elemental && (
                        <div className="bg-blue-900/30 rounded-lg p-2 border border-blue-500/30">
                          <h5 className="text-blue-300 text-[10px] font-bold mb-1 uppercase tracking-wide">Element</h5>
                          <p className="text-white/80 text-[10px] leading-tight">{card.Elemental}</p>
                        </div>
                      )}
                      
                      {/* Numerology - Tüm kartlar için */}
                      {card.Numerology && (
                        <div className="bg-green-900/30 rounded-lg p-2 border border-green-500/30">
                          <h5 className="text-green-300 text-[10px] font-bold mb-1 uppercase tracking-wide">Number</h5>
                          <p className="text-white/80 text-[10px] leading-tight">{card.Numerology}</p>
                        </div>
                      )}
                      
                      {/* Mythical/Spiritual - Tüm kartlar için */}
                      {card["Mythical/Spiritual"] && (
                        <div className="bg-orange-900/30 rounded-lg p-2 border border-orange-500/30">
                          <h5 className="text-orange-300 text-[10px] font-bold mb-1 uppercase tracking-wide">Mythical</h5>
                          <p className="text-white/80 text-[10px] leading-tight line-clamp-2">{card["Mythical/Spiritual"]}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Fortune Telling - Kompakt */}
                    {card.fortune_telling && card.fortune_telling.length > 0 && (
                      <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-2 border border-yellow-500/30">
                        <h5 className="text-yellow-300 text-[10px] font-bold mb-1 uppercase tracking-wide">Fortune</h5>
                        <p className="text-white/80 text-[10px] leading-tight line-clamp-2">
                          {card.fortune_telling[0]}
                          {card.fortune_telling.length > 1 && "..."}
                        </p>
                      </div>
                    )}
                    
                    {/* Click for details hint */}
                    <div className="text-center pt-2">
                      <span className="text-accent-gold/70 text-[9px] font-medium italic">
                        {translations.reading_card_click_for_details}
                      </span>
                    </div>
                  </div>
                  
                  {/* Hover efekti */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/0 to-accent-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
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