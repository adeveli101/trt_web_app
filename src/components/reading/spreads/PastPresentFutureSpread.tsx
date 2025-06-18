"use client";
import React from "react";
import { TarotCard } from "../../../lib/tarotTypes";
import TarotCardSingle from "../TarotCardSingle";

export default function PastPresentFutureSpread({ selectedCards, meaningTitles, meanings, onCardClick }: {
  selectedCards: TarotCard[];
  meaningTitles: string[];
  meanings?: string[];
  onCardClick?: (card: TarotCard) => void;
}) {
  return (
    <div className="flex flex-col items-center w-full gap-4">
      <div className="flex flex-row flex-wrap justify-center items-end gap-4 w-full">
        {[0,1,2].map(i => (
          <div key={i} className="flex flex-col items-center flex-1 min-w-[80px] max-w-[180px] cursor-pointer" onClick={() => onCardClick && selectedCards[i] && onCardClick(selectedCards[i])}>
            <TarotCardSingle card={selectedCards[i]} meaningTitle={meaningTitles[i]} {...(meanings ? { meaning: meanings[i] } : {})} size="md" />
          </div>
        ))}
      </div>
    </div>
  );
} 