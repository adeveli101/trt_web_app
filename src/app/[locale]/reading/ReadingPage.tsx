"use client";

import React from "react";
import ReadingStepper from "../../../components/reading/ReadingStepper";

export default function ReadingPage({
  locale,
  translations,
  error,
  steps,
}: {
  locale: string;
  translations: any;
  error: string | null;
  steps: any[];
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex flex-col">
      {error && (
        <div className="text-center text-red-600 font-bold mb-4">{error}</div>
      )}
      <main className="pt-[var(--navbar-height-mobile)] md:pt-[var(--navbar-height)] mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <ReadingStepper steps={steps} translations={translations} />
      </main>
    </div>
  );
}