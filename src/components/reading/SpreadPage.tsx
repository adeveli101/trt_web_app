"use client";
import React from "react";
import ReadingStepper from "./ReadingStepper";

export default function SpreadPage({ spread, locale, steps, translations, spreadsData }: { spread: string, locale: string, steps: any[], translations: any, spreadsData: any[] }) {
  const spreadObj = spreadsData.find((s: any) => s.key === spread);
  if (!spreadObj) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">Spread not found.</div>;
  }
  return (
    <div className="min-h-screen flex flex-col items-center bg-[var(--bg-color)]">
      <h1 className="text-3xl font-bold mt-8 mb-4 text-accent-gold drop-shadow-lg">{spreadObj.label}</h1>
      {/* <img src={spreadObj.image} alt={spreadObj.label} className="mb-6 w-full max-w-md rounded shadow" /> */}
      <p className="mb-8 text-lg text-gray-700 max-w-2xl text-center">{spreadObj.desc}</p>
      {/* Burada spread'e özel bir kart seçimi başlatılabilir */}
      <div className="w-full max-w-3xl mx-auto flex-1">
        <ReadingStepper steps={steps} translations={translations} />
      </div>
    </div>
  );
} 