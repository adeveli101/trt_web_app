"use client";

import React from "react";
import { TarotCard } from "../../../lib/tarotTypes";
import TarotCardSingle from "../TarotCardSingle";

export default function HorseshoeSpread({ selectedCards, meaningTitles, meanings }: {
  selectedCards: TarotCard[];
  meaningTitles: string[];
  meanings?: string[];
}) {
  // Yay şeklinde dizilim için açı hesapla
  const count = 7;
  const angleStep = Math.PI / (count - 1);
  return (
    <div className="relative w-full" style={{ aspectRatio: '2.5/1', minHeight: 0 }}>
      {selectedCards.map((card, i) => {
        const angle = Math.PI - i * angleStep;
        const x = 50 + 40 * Math.cos(angle); // % cinsinden
        const y = 60 - 40 * Math.sin(angle);
        return (
          <div
            key={card?.name || i}
            className="absolute flex flex-col items-center"
            style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
          >
            <TarotCardSingle card={card} meaningTitle={meaningTitles[i]} {...(meanings ? { meaning: meanings[i] } : {})} size="md" />
          </div>
        );
      })}
    </div>
  );
} 