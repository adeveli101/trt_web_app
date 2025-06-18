"use client";
import IntentionStep from "@/components/reading/IntentionStep";
import { useRouter } from "next/navigation";
import StepperBarClientWrapper from "@/components/reading/StepperBarClientWrapper";
import CosmicBackground from "@/components/layout/CosmicBackground";

export default function IntentionPageClientWrapper({
  locale,
  category,
  spread,
  translations,
  steps
}: {
  locale: string;
  category: string;
  spread: string;
  translations: any;
  steps: any[];
}) {
  const router = useRouter();

  function handleContinue(prompt: string) {
    if (prompt.trim().length > 0) {
      localStorage.setItem('userIntention', prompt);
    }
    router.push(`/${locale}/reading/category/${category}/spread/${spread}/intention/cards`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#2a1746] via-[#3a1053] to-[var(--bg-color)] w-full">
      <CosmicBackground />
      <div className="sticky top-0 z-40 w-full">
        <StepperBarClientWrapper
          steps={steps}
          categorySelected={!!category}
          category={category}
          locale={locale}
          spread={spread}
        />
      </div>
      <div className="w-full px-0">
        <div className="flex flex-col items-center">
          <IntentionStep
            locale={locale}
            translations={translations}
            category={category}
            spread={spread}
            steps={steps}
            onContinue={handleContinue}
            onSkip={() => handleContinue("")}
          />
        </div>
      </div>
    </div>
  );
} 