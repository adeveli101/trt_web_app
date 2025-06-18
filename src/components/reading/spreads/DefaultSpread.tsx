"use client";
import React from "react";
import { TarotCard } from "../../../lib/tarotTypes";
import TarotCardSingle from "../TarotCardSingle";

export default function DefaultSpread({ selectedCards, onCardClick }: {
  selectedCards: TarotCard[];
  onCardClick?: (card: TarotCard) => void;
}) {
  return (
    <div className="flex flex-col items-center w-full gap-4">
      <div className="flex flex-wrap gap-4 justify-center w-full">
        {selectedCards.map((card, i) => (
          <div key={card?.name || i} className="cursor-pointer" onClick={() => onCardClick && card && onCardClick(card)}>
            <TarotCardSingle card={card} size="md" />
          </div>
        ))}
      </div>
    </div>
  );
} 