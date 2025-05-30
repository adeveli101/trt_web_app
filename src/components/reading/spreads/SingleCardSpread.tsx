"use client";
import React from "react";
import { TarotCard } from "../../../lib/tarotTypes";
import TarotCardSingle from "../TarotCardSingle";

export default function SingleCardSpread({ selectedCards, meaning, meaningTitle }: {
  selectedCards: TarotCard[];
  meaning?: string;
  meaningTitle?: string;
}) {
  return (
    <div className="flex flex-col justify-center items-center w-full gap-4">
      {selectedCards[0] ? (
        <TarotCardSingle card={selectedCards[0]} meaning={meaning} meaningTitle={meaningTitle} size="md" />
      ) : (
        <TarotCardSingle isBack={true} size="md" />
      )}
    </div>
  );
} 