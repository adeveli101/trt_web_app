"use client";
import React from "react";
import { TarotCard } from "../../../lib/tarotTypes";
import TarotCardSingle from "../TarotCardSingle";

export default function RelationshipSpread({ selectedCards, meaningTitles, meanings }: {
  selectedCards: TarotCard[];
  meaningTitles: string[];
  meanings?: string[];
}) {
  // Grid: [0,1], [2,3,4], [5,6]
  const grid = [
    [0, 1],
    [2, 3, 4],
    [5, 6],
  ];
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-4 w-full place-items-center">
      {grid.flat().map((idx, i) => idx !== undefined ? (
        <div key={i} className="flex flex-col items-center">
          <TarotCardSingle card={selectedCards[idx as number]} meaningTitle={meaningTitles[idx as number]} {...(meanings ? { meaning: meanings[idx as number] } : {})} size="md" />
        </div>
      ) : <div key={i} />)}
    </div>
  );
} 