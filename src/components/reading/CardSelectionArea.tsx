"use client";
// components/reading/CardSelectionArea.tsx
import React, { useState } from "react";
import { TarotCard } from "../../lib/tarotTypes";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import TarotCardSingle from "./TarotCardSingle"; // Güncellenmiş TarotCardSingle bileşeni
import { Skeleton } from "@/components/ui/skeleton";

// BackCard: Kartın arka yüzü için component (Stepper border ile güncellenmedi, isterseniz TarotCardSingle'a benzer şekilde güncelleyebiliriz)
function BackCard() {
  return (
    <div className="w-28 h-40 rounded-xl border-4 border-yellow-400 bg-gradient-to-br from-purple-900 via-purple-700 to-yellow-300 flex items-center justify-center relative shadow-card overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[url('/images/tarot_card_images/back_pattern.svg')] bg-cover bg-center" />
      <div className="z-10 flex flex-col items-center">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-2">
          <circle cx="24" cy="24" r="22" stroke="#FFD700" strokeWidth="3" fill="url(#grad)" />
          <defs>
            <radialGradient id="grad" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#fffbe6" />
              <stop offset="100%" stopColor="#a78bfa" />
            </radialGradient>
          </defs>
        </svg>
        <span className="text-yellow-300 font-bold text-lg drop-shadow">Tarot</span>
      </div>
    </div>
  );
}

// Basit sekme componenti
function Tabs({ tabs, active, onTab }: { tabs: string[]; active: string; onTab: (tab: string) => void }) {
  return (
    <div className="flex gap-2 mb-4 justify-center">
      {tabs.map(tab => (
        <button
          key={tab}
          className={`px-3 py-1 rounded-full font-semibold text-sm transition-all border-2 ${active === tab ? "bg-gradient-to-r from-purple-500 to-yellow-300 text-white border-yellow-400 shadow-lg" : "bg-white/60 text-purple-700 border-purple-200 hover:bg-purple-100"}`}
          onClick={() => onTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default function CardSelectionArea({ selectedCards, onRemove, spreadCardCount, label, positionDescription, cardSize, translations }: { selectedCards: TarotCard[], onRemove: (card: TarotCard) => void, spreadCardCount: number, label?: string, positionDescription?: string, cardSize?: 'sm' | 'lg', translations: any }) {
  const [modalCard, setModalCard] = useState<TarotCard | null>(null);
  const [activeTab, setActiveTab] = useState(translations['reading_card_keywords']);

  // Kart arka yüzü gösterilecek mi?
  if (selectedCards.length === 0 && spreadCardCount > 0) {
    return <Skeleton className="w-28 h-40 rounded-xl" />;
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center md:justify-between mb-6 min-h-[80px] w-full px-8 mx-auto">
      <AnimatePresence>
        {selectedCards.map((card, idx) => (
          <motion.div
            key={card.name}
            initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, zIndex: 10 + idx }}
            exit={{ opacity: 0, scale: 0.7, rotate: 10 }}
            transition={{ duration: 0.5, delay: idx * 0.08, type: "spring" }}
          >
            <div className="relative w-full h-full flex items-center justify-center overflow-visible">
              <Dialog open={modalCard?.name === card.name} onOpenChange={open => setModalCard(open ? card : null)}>
                <DialogTrigger asChild>
                  <div onClick={() => setModalCard(card)} className="cursor-pointer">
                    {/* Hata düzeltildi: 'label' yerine 'meaningTitle' kullanıldı */}
                    <TarotCardSingle card={card} meaningTitle={label} size={cardSize === 'sm' ? 'sm' : 'md'} />
                  </div>
                </DialogTrigger>
                <DialogContent className="bg-gradient-to-br from-purple-900/95 via-purple-700/90 to-yellow-100/80 backdrop-blur-2xl border-4 border-yellow-400 shadow-gold p-8 min-w-[320px] max-w-md text-center relative rounded-2xl">
                  <DialogTitle className="text-2xl font-extrabold mb-2 text-yellow-400 drop-shadow">{card.name}</DialogTitle>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 40 }}
                    animate={{ opacity: 1, scale: 1.2, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: 40 }}
                    transition={{ duration: 0.4, type: "spring" }}
                  >
                    <button
                      className="absolute top-4 right-4 text-yellow-400 hover:text-white text-3xl font-bold focus:outline-none z-20 transition-all"
                      onClick={() => setModalCard(null)}
                      aria-label="Close"
                    >
                      ✦
                    </button>
                    <div className="flex justify-center mb-4">
                      {/* Burada Dialog içindeki kart gösteriminde sadece kartı gösteriyoruz, anlam ve başlık Dialog'un kendi içinde yönetiliyor */}
                      <TarotCardSingle card={card} size="md" />
                    </div>
                    <div className="text-sm text-yellow-200 mb-2">{card.arcana} {card.suit ? `- ${card.suit}` : ''}</div>
                    {/* Tabs */}
                    <Tabs
                      tabs={[translations['reading_card_keywords'], translations['reading_card_fortune'], translations['reading_card_meanings'], translations['reading_card_details']]}
                      active={activeTab}
                      onTab={setActiveTab}
                    />
                    <div className="text-left">
                      {activeTab === translations['reading_card_keywords'] && card.keywords && (
                        <div className="mb-2">
                          <span className="font-semibold text-yellow-300">{translations['reading_card_keywords']}: </span>
                          <span className="text-white">{card.keywords.join(", ")}</span>
                        </div>
                      )}
                      {activeTab === translations['reading_card_fortune'] && card.fortune_telling && (
                        <div className="mb-2">
                          <span className="font-semibold text-pink-300">{translations['reading_card_fortune']}:</span>
                          <ul className="list-disc list-inside text-white text-sm mt-1">
                            {card.fortune_telling.map((ft: string, i: number) => <li key={i}>{ft}</li>)}
                          </ul>
                        </div>
                      )}
                      {activeTab === translations['reading_card_meanings'] && card.meanings && (
                        <div className="mb-2">
                          <span className="font-semibold text-yellow-200">{translations['reading_card_meanings']}:</span>
                          <div className="flex flex-row gap-4 mt-1">
                            <div>
                              <span className="font-semibold text-green-300 text-xs">{translations['reading_card_light']}</span>
                              <ul className="list-disc list-inside text-white text-xs mt-1">
                                {card.meanings.light.map((m: string, i: number) => <li key={i}>{m}</li>)}
                              </ul>
                            </div>
                            <div>
                              <span className="font-semibold text-red-300 text-xs">{translations['reading_card_shadow']}</span>
                              <ul className="list-disc list-inside text-white text-xs mt-1">
                                {card.meanings.shadow.map((m: string, i: number) => <li key={i}>{m}</li>)}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                      {activeTab === translations['reading_card_details'] && (
                        <div className="space-y-2">
                          {card.Archetype && (
                            <div className="text-xs text-yellow-200"><span className="font-semibold text-yellow-400">{translations['reading_card_archetype']}:</span> {card.Archetype}</div>
                          )}
                          {card["Hebrew Alphabet"] && (
                            <div className="text-xs text-blue-200"><span className="font-semibold text-blue-400">{translations['reading_card_hebrew']}:</span> {card["Hebrew Alphabet"]}</div>
                          )}
                          {card.Numerology && (
                            <div className="text-xs text-pink-200"><span className="font-semibold text-pink-400">{translations['reading_card_numerology']}:</span> {card.Numerology}</div>
                          )}
                          {card.Elemental && (
                            <div className="text-xs text-green-200"><span className="font-semibold text-green-400">{translations['reading_card_element']}:</span> {card.Elemental}</div>
                          )}
                          {card["Mythical/Spiritual"] && (
                            <div className="text-xs text-yellow-200"><span className="font-semibold text-yellow-400">{translations['reading_card_myth']}:</span> {card["Mythical/Spiritual"]}</div>
                          )}
                          {card["Questions to Ask"] && (
                            <div className="mb-2 text-left">
                              <span className="font-semibold text-indigo-200">{translations['reading_card_questions']}:</span>
                              <ul className="list-disc list-inside text-white text-xs mt-1">
                                {card["Questions to Ask"].map((q: string, i: number) => <li key={i}>{q}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {selectedCards.length === 0 && <span className="text-gray-400 italic">{translations['reading_card_no_selected']}</span>}
    </div>
  );
}