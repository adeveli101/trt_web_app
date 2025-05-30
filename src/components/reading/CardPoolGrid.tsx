"use client";
import React from "react";
import { TarotCard } from "../../lib/tarotTypes";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import TarotCardSingle from "./TarotCardSingle";
import { Skeleton } from "@/components/ui/skeleton";

export default function CardPoolGrid({ tarotCards, selectedCards, onSelect, maxSelectable, translations, loading = false } : {
  tarotCards: TarotCard[];
  selectedCards: TarotCard[];
  onSelect: (card: TarotCard) => void;
  maxSelectable: number;
  translations: any;
  loading?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto border rounded-xl p-4 bg-gradient-to-br from-purple-100 via-yellow-50 to-pink-50 shadow-inner w-full px-8 mx-auto">
      {(loading || tarotCards.length === 0) ? (
        Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="rounded-lg w-full h-32 md:h-44 bg-gradient-to-br from-purple-200 via-yellow-100 to-pink-100" />
        ))
      ) : (
        tarotCards.map((card, idx) => {
          const isSelected = selectedCards.some(c => c.name === card.name);
          const isDisabled = isSelected || selectedCards.length >= maxSelectable;
          return (
            <motion.button
              key={card.name}
              className={`relative rounded-lg transition-all duration-200 focus:outline-none group ${isSelected ? "cursor-not-allowed" : "hover:scale-105"}`}
              whileHover={!isDisabled ? { scale: 1.08, boxShadow: "0 0 12px #a78bfa" } : {}}
              whileTap={!isDisabled ? { scale: 0.96 } : {}}
              onClick={() => !isDisabled && onSelect(card)}
              disabled={isDisabled}
              style={{ transitionDelay: `${idx * 0.01}s` }}
            >
              <TarotCardSingle card={card} size="sm" />
              {isSelected && (
                <span className="absolute top-2 right-3 text-yellow-400 text-lg z-20">★</span>
              )}
              {isDisabled && (
                <span className="absolute inset-0 bg-white/60 rounded-lg z-10" />
              )}
            </motion.button>
          );
        })
      )}
    </div>
  );
} 