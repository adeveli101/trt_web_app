"use client";
import React from "react";
import { TarotCard } from "../../../lib/tarotTypes";
import TarotCardSingle from "../TarotCardSingle";

export default function YearlySpread({ selectedCards, meaningTitles, meanings }: {
  selectedCards: TarotCard[];
  meaningTitles: string[];
  meanings?: string[];
}) {
  // 1 summary + 12 months
  return (
    <div className="w-full flex flex-col items-center justify-center p-4 gap-8">
      {/* Summary Card - First card should be the yearly summary */}
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Cinzel Decorative, serif' }}>{meaningTitles[0]}</h3>
        {selectedCards[0] ? (
          <TarotCardSingle card={selectedCards[0]} meaningTitle={meaningTitles[0]} {...(meanings ? { meaning: meanings[0] } : {})} size="md" />
        ) : (
          <TarotCardSingle isBack={true} size="md" />
        )}
      </div>
      {/* Monthly Cards Grid - Cards 1-12 represent months */}
      <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={`month-card-${i}`} className="text-center">
            <h4 className="text-md font-medium mb-1" style={{ fontFamily: 'Cinzel Decorative, serif' }}>{meaningTitles[i + 1]}</h4>
            {selectedCards[i + 1] ? (
              <TarotCardSingle card={selectedCards[i + 1]} meaningTitle={meaningTitles[i + 1]} {...(meanings ? { meaning: meanings[i + 1] } : {})} size="sm" />
            ) : (
              <TarotCardSingle isBack={true} size="sm" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 