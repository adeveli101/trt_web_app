"use client";
import React, { useState, useEffect } from "react";

interface IntentionStepProps {
  locale: string;
  translations: Record<string, any>;
  category?: string;
  spread?: string;
  error?: string | null;
  maxLength?: number;
  onContinue?: (prompt: string) => void;
  onSkip?: () => void;
  steps?: any[];
}

export default function IntentionStep({
  locale,
  translations,
  category = "",
  spread = "",
  error = null,
  maxLength = 200,
  onContinue = () => {},
  onSkip = () => {},
  steps = [],
}: IntentionStepProps) {
  const [prompt, setPrompt] = useState("");
  const [touched, setTouched] = useState(false);
  const [selectedExample, setSelectedExample] = useState<number | null>(null);

  // Niyet değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (prompt.trim().length > 0) {
      localStorage.setItem('userIntention', prompt);
    }
  }, [prompt]);

  // Örnek niyetler: önce kategoriye göre, yoksa genel
  const exampleKeys = [
    `intention_${category}_examples`,
    "intention_general_examples",
  ];
  let examples: string[] = [];
  for (const key of exampleKeys) {
    const ex = translations[key];
    if (Array.isArray(ex) && ex.length > 0) {
      examples = ex;
      break;
    }
  }

  // Motivasyon cümleleri
  const motivations = [
    translations["prompt_step_motivation_1"],
    translations["prompt_step_motivation_2"],
    translations["prompt_step_motivation_3"],
  ].filter(Boolean);

  const isValid = prompt.trim().length > 0 && prompt.length <= maxLength;

  return (
    <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center animate-fade-in bg-black/30 rounded-xl shadow-lg p-3 mt-4">
      <h2 className="mb-2 text-accent-gold drop-shadow-lg text-2xl font-bold text-center">
        {translations["prompt_step_title"] || "Set Your Intention"}
      </h2>
      <p className="mb-6 text-base md:text-lg text-gray-200 text-center font-cabin max-w-xl">
        {translations["prompt_step_desc"] || "Before you draw the cards, set a clear intention or question."}
      </p>

      {/* Örnek niyetler */}
      {examples.length > 0 && (
        <div className="mb-6 w-full flex flex-wrap gap-2 justify-center">
          {examples.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setPrompt(ex);
                setTouched(true);
                setSelectedExample(i);
              }}
              className={`px-4 py-2 rounded-full border-2 font-cabin text-sm md:text-base transition-all duration-200 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold
                ${selectedExample === i
                  ? "bg-accent-gold text-white border-accent-gold"
                  : "bg-black/30 text-accent-gold border-accent-gold hover:bg-accent-gold/90 hover:text-white"}
              `}
              aria-label={ex}
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {/* Niyet textarea */}
      <div className="w-full mb-2">
        <textarea
          className="w-full min-h-[100px] max-h-40 rounded-lg border-2 border-accent-gold bg-black/40 text-white font-cabin p-3 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold resize-none transition"
          placeholder={translations["prompt_step_placeholder"] || "Type your intention or question..."}
          value={prompt}
          maxLength={maxLength}
          onChange={e => {
            setPrompt(e.target.value);
            setTouched(true);
            setSelectedExample(null);
          }}
          aria-label={translations["prompt_step_placeholder"] || "Type your intention or question..."}
        />
        <div className="flex justify-between items-center mt-1 text-xs text-gray-400">
          <span>{prompt.length}/{maxLength}</span>
          {!isValid && touched && (
            <span className="text-red-400">{translations["prompt_step_invalid"] || "Please enter an intention."}</span>
          )}
        </div>
      </div>

      {/* Butonlar */}
      <div className="flex flex-row gap-4 mt-6 w-full justify-center">
        <button
          type="button"
          onClick={() => onSkip()}
          className="font-cabin min-w-[100px] px-4 py-2 rounded border border-accent-gold bg-transparent text-accent-gold hover:bg-accent-gold hover:text-black transition"
        >
          {translations["prompt_step_skip"] || "Skip"}
        </button>
        <button
          type="button"
          onClick={() => onContinue(prompt)}
          disabled={!isValid}
          className="bg-accent-gold text-white font-cabin font-bold hover:bg-yellow-400 hover:text-white transition min-w-[120px] px-4 py-2 rounded disabled:opacity-50"
        >
          {translations["prompt_step_continue"] || "Continue"}
        </button>
      </div>

      {/* Motivasyon cümleleri */}
      {motivations.length > 0 && (
        <div className="mt-8 w-full flex flex-col items-center gap-2">
          {motivations.map((m, i) => (
            <span key={i} className="text-xs md:text-sm text-accent-gold/80 font-cabin text-center animate-fade-in">
              {m}
            </span>
          ))}
        </div>
      )}

      {/* Hata mesajı */}
      {error && (
        <div className="mt-4 text-center text-red-500 font-bold">{error}</div>
      )}
    </div>
  );
} 