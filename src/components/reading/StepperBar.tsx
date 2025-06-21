"use client";
import React from "react";
import clsx from "clsx";
import { StepSeparatorSVG } from "../ui/StepSeparatorSVG";
import { useTranslations } from "next-intl";

export default function StepperBar({ step, onStepChange, categorySelected, category, steps: stepsProp }: { step: number; onStepChange: (step: 0 | 1 | 2 | 3) => void, categorySelected?: boolean, category?: string, steps?: any[] }) {
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
  const steps = stepsProp || defaultSteps;

  // Tailwind'e eklenmiş olması gereken animasyon örneği:
  // .animate-gradient-move { background-size: 200% 200%; animation: gradientMove 8s ease-in-out infinite; }
  // @keyframes gradientMove { 0% {background-position:0% 50%} 50% {background-position:100% 50%} 100% {background-position:0% 50%} }

  return (
    <div className="flex flex-col items-center w-full mb-8 sticky top-0 z-30 py-3 rounded-b-2xl overflow-hidden"
      style={{
        background: "linear-gradient(120deg, #180026 0%, #3B006A 50%, #7A2062 100%)",
        animation: "gradientMove 16s ease-in-out infinite",
        backgroundSize: "200% 200%"
      }}
    >
      <style>{`
        @keyframes gradientMove {
          0% {background-position:0% 50%}
          50% {background-position:100% 50%}
          100% {background-position:0% 50%}
        }
      `}</style>
      <div className="flex items-center justify-center w-full px-8 relative overflow-x-auto scrollbar-hide">
        {steps.map((s, i) => {
          const isClickable = i < step;
          return (
            <React.Fragment key={s.label}>
              <div className="flex flex-col items-center relative z-10">
                <div className="relative flex items-center justify-center">
                  <button
                    type="button"
                    disabled={!isClickable}
                    onClick={isClickable ? () => onStepChange(i as 0 | 1 | 2 | 3) : undefined}
                    className={clsx(
                      "transition-all duration-300 relative z-10 overflow-hidden rounded-xl flex items-center justify-center p-0.5",
                      step === i
                        ? "w-24 h-16 sm:w-28 sm:h-20 md:w-40 md:h-28 border-[2.5px] border-animated-darkred shadow-[0_4px_32px_0_#2c001888]"
                        : step > i
                          ? "w-20 h-13 sm:w-22 sm:h-16 md:w-32 md:h-20 border-2 border-green-400"
                          : "w-20 h-13 sm:w-22 sm:h-16 md:w-32 md:h-20 border border-[#2c0018]/60",
                      !isClickable && "pointer-events-none opacity-60"
                    )}
                    aria-current={step === i ? "step" : undefined}
                  >
                    {step === i && (
                      <style>{`                        @keyframes borderDarkRed {
                          0% { border-image: linear-gradient(120deg, #2c0018, #6a003a, #000) 1; }
                          50% { border-image: linear-gradient(240deg, #000, #6a003a, #2c0018) 1; }
                          100% { border-image: linear-gradient(120deg, #2c0018, #6a003a, #000) 1; }
                        }
                        .border-animated-darkred {
                          border-image: linear-gradient(120deg, #2c0018, #6a003a, #000) 1;
                          animation: borderDarkRed 6s ease-in-out infinite;
                        }
                      `}</style>
                    )}
                    <img
                      src={s.icon}
                      alt={s.label}
                      className="w-full h-full object-contain rounded-xl pointer-events-none"
                    />
                  </button>
                </div>
                <span className={clsx(
                  "mt-2 text-xs sm:text-sm font-semibold transition-colors text-center",
                  step === i ? "text-accent-gold drop-shadow" : i < step ? "text-primary" : "text-gray-400"
                )}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex flex-col items-center justify-center mx-1 sm:mx-2 min-w-0">
                  <StepSeparatorSVG />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
} 
