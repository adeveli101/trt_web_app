"use client";
import { useState } from "react";
import UnveilButton from "@/components/reading/UnveilButton";
import StepperBarClientWrapper from "@/components/reading/StepperBarClientWrapper";
import CelticCrossSpread from "@/components/reading/spreads/CelticCrossSpread";
import FiveCardPathSpread from "@/components/reading/spreads/FiveCardPathSpread";
import HorseshoeSpread from "@/components/reading/spreads/HorseshoeSpread";
import PastPresentFutureSpread from "@/components/reading/spreads/PastPresentFutureSpread";
import RelationshipSpread from "@/components/reading/spreads/RelationshipSpread";
import SingleCardSpread from "@/components/reading/spreads/SingleCardSpread";
import YearlySpread from "@/components/reading/spreads/YearlySpread";
import DefaultSpread from "@/components/reading/spreads/DefaultSpread";
import tarotCardsData from "@/lib/data/tarot_cards_en.json";
import SectionHeading from "@/components/ui/SectionHeading";
import CosmicBackground from "@/components/layout/CosmicBackground";

const spreadComponentMap: Record<string, any> = {
  celticCross: CelticCrossSpread,
  fiveCardPath: FiveCardPathSpread,
  horseshoeSpread: HorseshoeSpread,
  pastPresentFuture: PastPresentFutureSpread,
  relationshipSpread: RelationshipSpread,
  singleCard: SingleCardSpread,
  yearlySpread: YearlySpread,
};

export default function SpreadPageClientWrapper({ spreadObj, locale, category, translations, steps }: { spreadObj: any, locale: string, category?: string, translations: any, steps: any[] }) {
  const [revealed, setRevealed] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [selectedCards, setSelectedCards] = useState<any[]>([]);
  const cardCount = spreadObj.cardCount || 3;
  const meaningTitles = (spreadObj.positions || []).map((pos: string) => pos) || [];
  const meanings = Array(cardCount).fill("");
  const SpreadComponent = spreadComponentMap[spreadObj.key] || DefaultSpread;

  function handleReveal() {
    setRevealing(true);
    setTimeout(() => {
      const allCards = tarotCardsData.cards;
      const shuffled = [...allCards].sort(() => Math.random() - 0.5);
      setSelectedCards(shuffled.slice(0, cardCount));
      setRevealing(false);
      setRevealed(true);
    }, 1500);
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center w-full bg-[var(--bg-color)] py-12 md:py-20 px-2 md:px-8">
      <CosmicBackground />
      <div className="sticky top-0 z-40 w-full">
        <StepperBarClientWrapper
          categorySelected={!!category}
          category={category}
          locale={locale}
          spread={spreadObj.key}
        />
      </div>
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center justify-center px-2 sm:px-4 mt-4 text-center">
        <SectionHeading className="mb-4 text-accent-gold drop-shadow-lg text-center" font="cinzel">
          {spreadObj.label}
        </SectionHeading>
        <p className="mb-8 text-lg text-gray-300 max-w-2xl text-center font-cabin">{spreadObj.desc}</p>
        {!revealed && !revealing ? (
          <img
            src={spreadObj.image}
            alt={spreadObj.label}
            className="w-full max-w-md rounded-xl mb-6 mx-auto border border-[var(--accent-color)] shadow transition-all duration-300 hover:border-accent-gold hover:shadow-gold hover:scale-105"
            style={{ boxSizing: 'border-box' }}
          />
        ) : revealing ? (
          <div className="flex justify-center items-center w-full mt-8 min-h-[220px]">
            <img
              src="/images/cardsRevealing.gif"
              alt="Revealing cards..."
              className="w-full max-w-2xl h-auto object-contain rounded-xl shadow-lg border border-yellow-200/40"
              style={{ aspectRatio: '16/9' }}
            />
          </div>
        ) : (
          <div className="flex justify-center items-center w-full mt-8">
            <SpreadComponent selectedCards={selectedCards} meaningTitles={meaningTitles} meanings={meanings} />
          </div>
        )}
        {!revealed && !revealing ? (
          <div className="flex justify-center w-full max-w-md mx-auto">
            <UnveilButton
              label={translations.reading_unveil_button || 'Unveil the Stars'}
              onClick={handleReveal}
              style={{ maxWidth: '18rem' }}
            />
          </div>
        ) : (
          <div className="flex justify-center items-center w-full mt-8">
            <SpreadComponent selectedCards={selectedCards} meaningTitles={meaningTitles} meanings={meanings} />
          </div>
        )}
      </div>
    </section>
  );
} 