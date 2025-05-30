"use client";
import React from "react";
import ReadingStepper from "./ReadingStepper";

export default function CategoryPage({ category, locale, steps, translations, categoriesData }: { category: string, locale: string, steps: any[], translations: any, categoriesData: any[] }) {
  const categoryObj = categoriesData.find((cat: any) => cat.key === category);
  if (!categoryObj) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">Category not found.</div>;
  }
  return (
    <div className="min-h-screen flex flex-col items-center bg-[var(--bg-color)]">
      <h1 className="text-3xl font-bold mt-8 mb-4 text-accent-gold drop-shadow-lg">{categoryObj.label}</h1>
      <p className="mb-8 text-lg text-gray-700 max-w-2xl text-center">{categoryObj.insight}</p>
      {/* Burada kategoriye özel bir adım veya spread seçimi başlatılabilir */}
      <div className="w-full max-w-3xl mx-auto flex-1">
        <ReadingStepper initialCategory={categoryObj.key} steps={steps} translations={translations} />
      </div>
    </div>
  );
} 