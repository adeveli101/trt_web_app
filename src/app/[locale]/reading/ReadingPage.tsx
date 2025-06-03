"use client";

import React from "react";
import ReadingStepper from "../../../components/reading/ReadingStepper";

// Define Step type for steps prop
interface Step {
  label: string;
  desc: string;
  icon: string;
  keyword: string;
}

export default function ReadingPage({
  locale,
  translations,
  error,
  steps,
}: {
  locale: string;
  translations: Record<string, string>;
  error: string | null;
  steps: Step[];
}) {
  return (
    <>
      {error && (
        <div className="text-center text-red-600 font-bold mb-4">{error}</div>
      )}
      <main className="mx-auto w-full flex-1">
        <ReadingStepper steps={steps} translations={translations} />
      </main>
    </>
  );
}