"use client";
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { TarotCard } from "@/lib/tarotTypes";

export default function TarotCardSheet({
  open,
  onOpenChange,
  card,
  translations
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: TarotCard | null;
  translations: any;
}) {
  if (!card) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#2a1746] via-[#3a1053] to-[var(--bg-color)] border-t-2 border-yellow-400 p-0 rounded-t-2xl shadow-2xl">
        <SheetHeader className="items-center pt-6 pb-2">
          <SheetTitle className="text-2xl font-bold text-accent-gold drop-shadow mb-1 text-center" style={{ fontFamily: 'Cinzel Decorative, serif' }}>{card.name}</SheetTitle>
          <SheetDescription className="text-center text-base text-gray-200 mb-2">
            {card.arcana}{card.suit ? ` - ${card.suit}` : ''}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col items-center px-4 pb-6 gap-3 w-full">
          {card.img && (
            <img src={`/images/tarot_card_images/${card.img}`} alt={card.name} className="w-32 h-52 object-contain rounded-lg shadow-lg border border-yellow-300 bg-white/80 mb-2" />
          )}
          {card.keywords && (
            <div className="w-full text-center">
              <span className="font-semibold text-yellow-300">{translations['reading_card_keywords']}: </span>
              <span className="text-white">{card.keywords.join(", ")}</span>
            </div>
          )}
          {card.fortune_telling && (
            <div className="w-full text-center">
              <span className="font-semibold text-pink-300">{translations['reading_card_fortune']}: </span>
              <span className="text-white">{card.fortune_telling.join(", ")}</span>
            </div>
          )}
          {card.meanings && (
            <div className="w-full flex flex-col md:flex-row gap-2 justify-center">
              <div className="flex-1">
                <span className="font-semibold text-green-300">{translations['reading_card_light']}</span>
                <ul className="list-disc list-inside text-white text-sm mt-1">
                  {card.meanings.light.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
              <div className="flex-1">
                <span className="font-semibold text-red-300">{translations['reading_card_shadow']}</span>
                <ul className="list-disc list-inside text-white text-sm mt-1">
                  {card.meanings.shadow.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
            </div>
          )}
          <div className="w-full flex flex-col gap-1 mt-2">
            {card.Archetype && (
              <div className="text-xs text-yellow-200"><span className="font-semibold text-yellow-400">{translations['reading_card_archetype']}: </span>{card.Archetype}</div>
            )}
            {card["Hebrew Alphabet"] && (
              <div className="text-xs text-blue-200"><span className="font-semibold text-blue-400">{translations['reading_card_hebrew']}: </span>{card["Hebrew Alphabet"]}</div>
            )}
            {card.Numerology && (
              <div className="text-xs text-pink-200"><span className="font-semibold text-pink-400">{translations['reading_card_numerology']}: </span>{card.Numerology}</div>
            )}
            {card.Elemental && (
              <div className="text-xs text-green-200"><span className="font-semibold text-green-400">{translations['reading_card_element']}: </span>{card.Elemental}</div>
            )}
            {card["Mythical/Spiritual"] && (
              <div className="text-xs text-yellow-200"><span className="font-semibold text-yellow-400">{translations['reading_card_myth']}: </span>{card["Mythical/Spiritual"]}</div>
            )}
            {card["Questions to Ask"] && (
              <div className="mb-2 text-left">
                <span className="font-semibold text-indigo-200">{translations['reading_card_questions']}: </span>
                <ul className="list-disc list-inside text-white text-xs mt-1">
                  {card["Questions to Ask"].map((q: string, i: number) => <li key={i}>{q}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 