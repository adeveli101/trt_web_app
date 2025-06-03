"use client";
import StepperBar from "./StepperBar";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function StepperBarClientWrapper({ categorySelected, category, locale, spread }: {
  categorySelected?: boolean;
  category?: string;
  locale: string;
  spread: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');

  const steps = [
    {
      label: t('reading_step_category'),
      icon: '/images/icons/category.svg',
      desc: t('reading_step_desc_category'),
    },
    {
      label: t('reading_step_spread'),
      icon: '/images/icons/spread.svg',
      desc: t('reading_step_desc_spread'),
    },
    {
      label: t('reading_step_cards'),
      icon: '/images/icons/cards.svg',
      desc: t('reading_step_desc_cards'),
    },
  ];

  let step = 0;
  if (category && !spread) step = 1;
  if (category && spread) step = 2;
  if (typeof window !== 'undefined' && /\/cards\/result$/.test(window.location.pathname)) step = 3;

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
      categorySelected={categorySelected}
      category={category}
    />
  );
} 