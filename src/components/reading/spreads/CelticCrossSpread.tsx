"use client";
import React from "react";
import { TarotCard } from "../../../lib/tarotTypes";
import TarotCardSingle from "../TarotCardSingle";

export default function CelticCrossSpread({ selectedCards, meaningTitles, meanings }: {
  selectedCards: TarotCard[];
  meaningTitles: string[];
  meanings?: string[];
}) {
  // safeCards: ilk 10 kart
  const safeCards = selectedCards.slice(0, 10).filter(Boolean);
  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <div className="grid grid-cols-3 grid-rows-4 gap-x-2 gap-y-4 sm:gap-x-4 sm:gap-y-6 md:gap-x-6 md:gap-y-8 w-full max-w-lg mx-auto relative place-items-center">
        {/* Card 3: Crowns (Top Center) */}
        <div className="col-start-2 row-start-1">
          {safeCards[2] && (
            <TarotCardSingle card={safeCards[2]} meaningTitle={meaningTitles[2]} {...(meanings ? { meaning: meanings[2] } : {})} size="md" />
          )}
        </div>
        {/* Card 5: Behind (Left of Center) */}
        <div className="col-start-1 row-start-2">
          {safeCards[4] && (
            <TarotCardSingle card={safeCards[4]} meaningTitle={meaningTitles[4]} {...(meanings ? { meaning: meanings[4] } : {})} size="md" />
          )}
        </div>
        {/* Central Cross: Card 1 (You) and Card 2 (Crosses) */}
        <div className="col-start-2 row-start-2 relative flex items-center justify-center w-full h-full">
          {/* Card 1: You (Bottom Layer) */}
          {safeCards[0] && (
            <div className="absolute z-20">
              <TarotCardSingle card={safeCards[0]} meaningTitle={meaningTitles[0]} {...(meanings ? { meaning: meanings[0] } : {})} size="md" />
            </div>
          )}
          {/* Card 2: Crosses (Top Layer, Rotated) */}
          {safeCards[1] && (
            <div className="absolute z-30 rotate-45 transform">
              <TarotCardSingle card={safeCards[1]} meaningTitle={meaningTitles[1]} {...(meanings ? { meaning: meanings[1] } : {})} size="md" />
            </div>
          )}
        </div>
        {/* Card 4: Before (Right of Center) */}
        <div className="col-start-3 row-start-2">
          {safeCards[3] && (
            <TarotCardSingle card={safeCards[3]} meaningTitle={meaningTitles[3]} {...(meanings ? { meaning: meanings[3] } : {})} size="md" />
          )}
        </div>
        {/* Card 6: Beneath (Bottom Center) */}
        <div className="col-start-2 row-start-3">
          {safeCards[5] && (
            <TarotCardSingle card={safeCards[5]} meaningTitle={meaningTitles[5]} {...(meanings ? { meaning: meanings[5] } : {})} size="md" />
          )}
        </div>
        {/* Staff / Column of 4 Cards (Right Side) */}
        <div className="col-start-3 row-start-1 row-span-4 flex flex-col justify-around items-center gap-y-4">
          {safeCards[6] && (
            <TarotCardSingle card={safeCards[6]} meaningTitle={meaningTitles[6]} {...(meanings ? { meaning: meanings[6] } : {})} size="md" />
          )}
          {safeCards[7] && (
            <TarotCardSingle card={safeCards[7]} meaningTitle={meaningTitles[7]} {...(meanings ? { meaning: meanings[7] } : {})} size="md" />
          )}
          {safeCards[8] && (
            <TarotCardSingle card={safeCards[8]} meaningTitle={meaningTitles[8]} {...(meanings ? { meaning: meanings[8] } : {})} size="md" />
          )}
          {safeCards[9] && (
            <TarotCardSingle card={safeCards[9]} meaningTitle={meaningTitles[9]} {...(meanings ? { meaning: meanings[9] } : {})} size="md" />
          )}
        </div>
      </div>
    </div>
  );
} 