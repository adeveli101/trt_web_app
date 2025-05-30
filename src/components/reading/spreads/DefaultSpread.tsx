"use client";
import React from "react";
import { TarotCard } from "../../../lib/tarotTypes";
import TarotCardSingle from "../TarotCardSingle";

export default function DefaultSpread({ selectedCards }: {
  selectedCards: TarotCard[];
}) {
  return (
    <div className="flex flex-col items-center w-full gap-4">
      <div className="flex flex-wrap gap-4 justify-center w-full">
        {selectedCards.map((card, i) => (
          <TarotCardSingle key={card?.name || i} card={card} size="md" />
        ))}
      </div>
    </div>
  );
} 