"use client";
import React, { useState, useEffect } from "react";
import { TarotCard, SpreadType } from "../../lib/tarotTypes";
import tarotCardsData from "../../lib/data/tarot_cards_en.json";
import UnveilButton from './UnveilButton';

interface CardSelectProps {
  spread: SpreadType;
  selectedCards: TarotCard[];
  setSelectedCards: React.Dispatch<React.SetStateAction<TarotCard[]>>;
  translations: any;
  onRevealStart?: () => void;
  onRevealComplete?: () => void;
}

export default function CardSelect({
  spread,
  selectedCards,
  setSelectedCards,
  translations,
  onRevealStart,
  onRevealComplete
}: CardSelectProps) {
  const tarotCards: TarotCard[] = tarotCardsData.cards;
  const [revealing, setRevealing] = useState(false);
  const [shuffleTrigger, setShuffleTrigger] = useState<number | null>(null);

  function handleUnveil() {
    if (onRevealStart) onRevealStart();
    setRevealing(true);
    setTimeout(() => {
      setSelectedCards([]);
      setShuffleTrigger(Date.now());
    }, 2200); // 2.2 saniye geçiş animasyonu
  }

  useEffect(() => {
    if (shuffleTrigger) {
      const available = [...tarotCards];
      const shuffled = available.sort(() => Math.random() - 0.5);
      let i = 0;
      function revealNext() {
        setSelectedCards((prev) => [...prev, shuffled[i]]);
        i++;
        if (i < spread.cardCount) {
          setTimeout(revealNext, 300);
        } else {
          setTimeout(() => {
            setRevealing(false);
            if (onRevealComplete) onRevealComplete();
          }, 500);
        }
      }
      setTimeout(revealNext, 300);
    }
  }, [shuffleTrigger, tarotCards, spread.cardCount, onRevealComplete]);

  return (
    <div className="flex flex-col items-center w-full">
      {revealing ? (
        <div className="flex flex-col items-center justify-center w-full py-8">
          <img src="/images/cardsRevealing.gif" alt="Revealing cards..." className="w-64 h-44 object-contain rounded-xl shadow-lg border-2 border-yellow-400" />
        </div>
      ) : (
        <UnveilButton
          label={translations.reading_unveil_button}
          onClick={handleUnveil}
          disabled={revealing}
        />
      )}
    </div>
  );
} 