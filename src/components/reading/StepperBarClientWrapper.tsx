"use client";
import StepperBar from "./StepperBar";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

export default function StepperBarClientWrapper({ categorySelected, category, locale, spread, steps: stepsProp }: {
  categorySelected?: boolean;
  category?: string;
  locale: string;
  spread: string;
  steps?: any[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();

  const defaultSteps = [
    {
      label: t('reading_step_category'),
      icon: '/images/steps/category_icon.png',
      desc: t('reading_step_desc_category'),
    },
    {
      label: t('reading_step_spread'),
      icon: '/images/steps/spread_icon.png',
      desc: t('reading_step_desc_spread'),
    },
    {
      label: t('reading_step_prompt'),
      icon: '/images/steps/intention_icon.png',
      desc: t('reading_step_desc_prompt'),
    },
    {
      label: t('reading_step_cards'),
      icon: '/images/steps/cards_icon.png',
      desc: t('reading_step_desc_cards'),
    },
    {
      label: t('reading_step_overview'),
      icon: '/images/steps/overview_icon.png',
      desc: t('reading_step_desc_overview'),
    },
  ];

  // Determine if we are on the category selection step
  const isCategoryStep = !category;

  // If on category selection, only show the next step (spread)
  const steps = stepsProp || (isCategoryStep
    ? [
        {
          label: t('reading_step_spread'),
          icon: '/images/icons/spread.svg',
          desc: t('reading_step_desc_spread'),
        },
      ]
    : defaultSteps);

  // Step index hesaplama
  const [step, setStep] = useState(0);

  useEffect(() => {
    let newStep = 0;
    if (category && !spread) newStep = 1;
    if (category && spread) newStep = 2;
    if (/\/intention$/.test(pathname)) newStep = 2;
    if (/\/intention\/cards$/.test(pathname)) newStep = 3;
    if (/\/intention\/cards\/overview$/.test(pathname)) newStep = 4;
    setStep(newStep);
  }, [pathname, category, spread]);

  function handleStepChange(newStep: 0 | 1 | 2 | 3 | 4) {
    if (newStep === 0) router.push(`/${locale}/reading`);
    else if (newStep === 1 && category) router.push(`/${locale}/reading/category/${category}`);
    else if (newStep === 2 && category && spread) router.push(`/${locale}/reading/category/${category}/spread/${spread}/intention`);
    else if (newStep === 3 && category && spread) router.push(`/${locale}/reading/category/${category}/spread/${spread}/intention/cards`);
    else if (newStep === 4 && category && spread) router.push(`/${locale}/reading/category/${category}/spread/${spread}/intention/cards/overview`);
  }

  return (
    <StepperBar
      step={step}
      onStepChange={handleStepChange}
      categorySelected={categorySelected}
      category={category}
      steps={steps}
    />
  );
} 