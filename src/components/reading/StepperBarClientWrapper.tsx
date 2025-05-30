"use client";
import StepperBar from "./StepperBar";
import { useRouter, usePathname } from "next/navigation";

export default function StepperBarClientWrapper({ steps, categorySelected, category, locale, spread }: {
  steps: any[];
  categorySelected?: boolean;
  category?: string;
  locale: string;
  spread: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // step'i route'a göre otomatik belirle (tam path eşleşmesiyle)
  let step = 0;
  if (/\/category\/[^/]+\/spread\/[^/]+\/cards\/result$/.test(pathname)) step = 3;
  else if (/\/category\/[^/]+\/spread\/[^/]+\/cards$/.test(pathname)) step = 2;
  else if (/\/category\/[^/]+\/spread\/[^/]+$/.test(pathname)) step = 1;
  else if (/\/category\/[^/]+$/.test(pathname)) step = 0;

  function handleStepChange(newStep: 0 | 1 | 2 | 3) {
    if (newStep === 0) router.push(`/${locale}/reading`);
    else if (newStep === 1 && category) router.push(`/${locale}/reading/category/${category}`);
    else if (newStep === 2 && category && spread) router.push(`/${locale}/reading/category/${category}/spread/${spread}/cards`);
    else if (newStep === 3 && category && spread) router.push(`/${locale}/reading/category/${category}/spread/${spread}/cards/result`);
  }

  return (
    <StepperBar
      step={step}
      onStepChange={handleStepChange}
      steps={steps}
      categorySelected={categorySelected}
      category={category}
    />
  );
} 