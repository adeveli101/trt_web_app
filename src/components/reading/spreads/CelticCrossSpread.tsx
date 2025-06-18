"use client";
import React from "react";
import { TarotCard } from "../../../lib/tarotTypes";
import TarotCardSingle from "../TarotCardSingle";

export default function CelticCrossSpread({ selectedCards, meaningTitles, meanings, onCardClick }: {
  selectedCards: TarotCard[];
  meaningTitles: string[];
  meanings?: string[];
  onCardClick?: (card: TarotCard) => void;
}) {
  // safeCards: ilk 10 kart
  const safeCards = selectedCards.slice(0, 10).filter(Boolean);
  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <div className="grid grid-cols-4 grid-rows-4 gap-x-2 gap-y-6 w-full max-w-2xl mx-auto place-items-center">
        {/* Card 3: Crowns (Top Center) */}
        <div className="col-start-2 col-span-2 row-start-1 flex justify-center">
          {safeCards[2] && (
            <div className="cursor-pointer" onClick={() => onCardClick && safeCards[2] && onCardClick(safeCards[2])}>
              <TarotCardSingle card={safeCards[2]} meaningTitle={meaningTitles[2]} {...(meanings ? { meaning: meanings[2] } : {})} size="md" />
            </div>
          )}
        </div>
        {/* Card 5: Behind (Left of Center) */}
        <div className="col-start-1 row-start-2 flex justify-center">
          {safeCards[4] && (
            <div className="cursor-pointer" onClick={() => onCardClick && safeCards[4] && onCardClick(safeCards[4])}>
              <TarotCardSingle card={safeCards[4]} meaningTitle={meaningTitles[4]} {...(meanings ? { meaning: meanings[4] } : {})} size="md" />
            </div>
          )}
        </div>
        {/* Central Cross: Card 1 (You) and Card 2 (Crosses) */}
        <div className="col-start-2 col-span-2 row-start-2 relative flex items-center justify-center group" style={{ minHeight: 160 }}>
          {/* Card 1: You (Bottom Layer) */}
          {safeCards[0] && (
            <div
              className="absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer group-hover:z-40"
              onMouseEnter={e => e.currentTarget.style.zIndex = '40'}
              onMouseLeave={e => e.currentTarget.style.zIndex = '20'}
              onClick={() => onCardClick && safeCards[0] && onCardClick(safeCards[0])}
            >
              <TarotCardSingle card={safeCards[0]} meaningTitle={meaningTitles[0]} {...(meanings ? { meaning: meanings[0] } : {})} size="md" />
            </div>
          )}
          {/* Card 2: Crosses (Top Layer, Rotated) */}
          {safeCards[1] && (
            <div
              className="absolute z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 cursor-pointer hover:z-40"
              onMouseEnter={e => e.currentTarget.style.zIndex = '40'}
              onMouseLeave={e => e.currentTarget.style.zIndex = '30'}
              onClick={() => onCardClick && safeCards[1] && onCardClick(safeCards[1])}
            >
              <TarotCardSingle card={safeCards[1]} meaningTitle={meaningTitles[1]} {...(meanings ? { meaning: meanings[1] } : {})} size="md" />
            </div>
          )}
        </div>
        {/* Card 4: Before (Right of Center) */}
        <div className="col-start-4 row-start-2 flex justify-center">
          {safeCards[3] && (
            <div className="cursor-pointer" onClick={() => onCardClick && safeCards[3] && onCardClick(safeCards[3])}>
              <TarotCardSingle card={safeCards[3]} meaningTitle={meaningTitles[3]} {...(meanings ? { meaning: meanings[3] } : {})} size="md" />
            </div>
          )}
        </div>
        {/* Card 6: Beneath (Bottom Center) */}
        <div className="col-start-2 col-span-2 row-start-3 flex justify-center">
          {safeCards[5] && (
            <div className="cursor-pointer" onClick={() => onCardClick && safeCards[5] && onCardClick(safeCards[5])}>
              <TarotCardSingle card={safeCards[5]} meaningTitle={meaningTitles[5]} {...(meanings ? { meaning: meanings[5] } : {})} size="md" />
            </div>
          )}
        </div>
        {/* Staff / Column of 4 Cards (Right Side, 4. satırda yan yana) */}
        <div className="col-start-1 row-start-4 flex justify-center">
          {safeCards[6] && (
            <div className="cursor-pointer" onClick={() => onCardClick && safeCards[6] && onCardClick(safeCards[6])}>
              <TarotCardSingle card={safeCards[6]} meaningTitle={meaningTitles[6]} {...(meanings ? { meaning: meanings[6] } : {})} size="md" />
            </div>
          )}
        </div>
        <div className="col-start-2 row-start-4 flex justify-center">
          {safeCards[7] && (
            <div className="cursor-pointer" onClick={() => onCardClick && safeCards[7] && onCardClick(safeCards[7])}>
              <TarotCardSingle card={safeCards[7]} meaningTitle={meaningTitles[7]} {...(meanings ? { meaning: meanings[7] } : {})} size="md" />
            </div>
          )}
        </div>
        <div className="col-start-3 row-start-4 flex justify-center">
          {safeCards[8] && (
            <div className="cursor-pointer" onClick={() => onCardClick && safeCards[8] && onCardClick(safeCards[8])}>
              <TarotCardSingle card={safeCards[8]} meaningTitle={meaningTitles[8]} {...(meanings ? { meaning: meanings[8] } : {})} size="md" />
            </div>
          )}
        </div>
        <div className="col-start-4 row-start-4 flex justify-center">
          {safeCards[9] && (
            <div className="cursor-pointer" onClick={() => onCardClick && safeCards[9] && onCardClick(safeCards[9])}>
              <TarotCardSingle card={safeCards[9]} meaningTitle={meaningTitles[9]} {...(meanings ? { meaning: meanings[9] } : {})} size="md" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 