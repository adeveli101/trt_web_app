"use client";
import React, { useState, useEffect } from "react";
import { TarotCard } from "../../lib/tarotTypes";
import { spreadPositions } from "@/lib/tarotLogic";
import tarotCardsData from "@/lib/data/tarot_cards_en.json";
import CelticCrossSpread from "./spreads/CelticCrossSpread";
import FiveCardPathSpread from "./spreads/FiveCardPathSpread";
import HorseshoeSpread from "./spreads/HorseshoeSpread";
import PastPresentFutureSpread from "./spreads/PastPresentFutureSpread";
import RelationshipSpread from "./spreads/RelationshipSpread";
import SingleCardSpread from "./spreads/SingleCardSpread";
import YearlySpread from "./spreads/YearlySpread";
import DefaultSpread from "./spreads/DefaultSpread";
import UnveilButton from "./UnveilButton";
import TarotCardSheet from './TarotCardSheet';

const spreadComponentMap: Record<string, any> = {
  celticCross: CelticCrossSpread,
  fiveCardPath: FiveCardPathSpread,
  horseshoeSpread: HorseshoeSpread,
  pastPresentFuture: PastPresentFutureSpread,
  relationshipSpread: RelationshipSpread,
  singleCard: SingleCardSpread,
  yearlySpread: YearlySpread,
};

export default function CardSelectionClientWrapper({
  spreadCardCount,
  label,
  positionDescription,
  cardSize,
  translations,
  spreadKey,
  image,
  desc,
  onNextStep,
}: {
  spreadCardCount: number;
  label?: string;
  positionDescription?: string;
  cardSize?: 'sm' | 'lg';
  translations: any;
  spreadKey: string;
  image?: string;
  desc?: string;
  onNextStep?: () => void;
}) {
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [revealing, setRevealing] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetCard, setSheetCard] = useState<TarotCard | null>(null);
  const tarotCards: TarotCard[] = tarotCardsData.cards;
  const [buttonScale, setButtonScale] = useState(1);

  function handleReveal() {
    setRevealing(true);
    setTimeout(() => {
      const available = [...tarotCards];
      const shuffled = available.sort(() => Math.random() - 0.5);
      setSelectedCards(shuffled.slice(0, spreadCardCount));
      setRevealing(false);
    }, 1200);
  }

  // Gif oynarken 2 saniye sonra revealing'i false yap
  useEffect(() => {
    if (revealing) {
      const timer = setTimeout(() => setRevealing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [revealing]);

  useEffect(() => {
    if (selectedCards.length === spreadCardCount) {
      localStorage.setItem(`selectedCards_${spreadKey}`, JSON.stringify(selectedCards));
    }
  }, [selectedCards, spreadCardCount, spreadKey]);

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

  if (selectedCards.length === spreadCardCount) {
    const SpreadComponent = spreadComponentMap[spreadKey] || DefaultSpread;
    const meaningTitles = spreadPositions[spreadKey] || selectedCards.map((_, i) => `Card ${i + 1}`);
    return (
      <div className="w-full flex flex-col items-center justify-center pb-32">
        <h2 className="text-2xl md:text-3xl font-bold text-accent-gold drop-shadow mb-6 text-center">
          {translations.reading_step_cards || 'Cards'}
        </h2>
        <SpreadComponent
          selectedCards={selectedCards}
          meaningTitles={meaningTitles}
          translations={translations}
          onCardClick={(card: TarotCard) => { setSheetCard(card); setSheetOpen(true); }}
        />
        <TarotCardSheet open={sheetOpen} onOpenChange={setSheetOpen} card={sheetCard} translations={translations} />
        {onNextStep && (
          <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 pointer-events-auto"
            style={{ transform: `scaleY(${buttonScale})`, transition: 'transform 0.2s cubic-bezier(.4,1.2,.4,1)' }}>
            <UnveilButton
              label={translations.reading_unveil_button || 'Illuminate the Cosmic Cards'}
              onClick={onNextStep}
              backgroundImage="/images/buttons/unveilTheStars_btn.png"
              style={{ maxWidth: 420, minWidth: 220, minHeight: 80, height: '14vw', maxHeight: 100 }}
            />
          </div>
        )}
      </div>
    );
  }

  // Kartlar seçilmeden önce spread görseli ve açıklaması
  return (
    <div className="w-full flex flex-col items-center justify-center py-4">
      {revealing ? (
        <>
          <div className="w-full max-w-2xl mx-auto mb-4">
            <span className="block text-2xl md:text-3xl font-bold text-accent-gold drop-shadow-lg text-center px-4 animate-fade-in">
              {translations.reading_cards_unveil_info || 'The cards are being unveiled...'}
            </span>
          </div>
          <div className="relative w-[98vw] max-w-2xl h-[360px] md:w-[546px] md:h-[364px] flex items-center justify-center overflow-hidden mb-6">
            <div className="absolute inset-0 bg-white z-0" />
            <img src="/images/cardsRevealing.gif" alt="Revealing cards..." className="relative w-full h-full object-cover z-10" />
          </div>
        </>
      ) : (
        <>
          {image && (
            <div className="relative w-[90vw] max-w-xl h-[260px] md:w-[420px] md:h-[260px] rounded-2xl shadow-xl border-2 border-yellow-400 mb-6 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-white z-0" />
              <img
                src={image}
                alt={label}
                className="relative w-full h-full object-cover rounded-2xl z-10 mx-auto"
              />
            </div>
          )}
          {label && (
            <h2 className="text-3xl md:text-4xl font-bold text-accent-gold drop-shadow mb-2 text-center">{label}</h2>
          )}
          {desc && (
            <p className="text-lg md:text-xl text-gray-100 text-center max-w-2xl mb-8">{desc}</p>
          )}
          <div className="mt-2 w-full flex justify-center">
            <UnveilButton
              label={translations.reading_card_auto_select || 'Draw Cards'}
              onClick={handleReveal}
              disabled={revealing}
              backgroundImage="/images/buttons/cardRevealButton_img.jpg"
              style={{ width: '80vw', maxWidth: 384, minWidth: 220, minHeight: 64, height: '14vw', maxHeight: 80 }}
            />
          </div>
          {/* Bilgilendirme layeri */}
          <div className="w-full max-w-xl mx-auto mb-2">
            <div className="text-center text-lg text-accent-gold font-cinzel animate-fade-in">
              {translations.reading_cards_info}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 