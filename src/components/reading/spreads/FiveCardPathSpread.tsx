"use client";
import React from "react";
import { TarotCard } from "../../../lib/tarotTypes";
import TarotCardSingle from "../TarotCardSingle";

export default function FiveCardPathSpread({ selectedCards, meaningTitles, meanings }: {
  selectedCards: TarotCard[];
  meaningTitles: string[];
  meanings?: string[];
}) {
  // Grid dizilimi: [null, 0, null], [1,2,3], [null,4,null]
  const grid = [
    [null, 0, null],
    [1, 2, 3],
    [null, 4, null],
  ];
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-4 w-full place-items-center">
      {grid.flat().map((idx, i) => idx !== null ? (
        <div key={i} className="flex flex-col items-center">
          <TarotCardSingle card={selectedCards[idx as number]} meaningTitle={meaningTitles[idx as number]} {...(meanings ? { meaning: meanings[idx as number] } : {})} size="md" />
        </div>
      ) : <div key={i} />)}
    </div>
  );
} 