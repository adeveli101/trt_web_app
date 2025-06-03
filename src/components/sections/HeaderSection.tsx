import React from "react";
import Button from "../ui/button";
import { useTranslations } from 'next-intl';

export default function HeaderSection({ headerVisible }: { headerVisible: boolean }) {
  const t = useTranslations('common');
  return (
    <>
      <header className="min-h-[calc(80vh-var(--navbar-height-mobile))] md:min-h-[calc(85vh-var(--navbar-height))] flex flex-col items-center justify-center text-center p-5 md:p-10 bg-gradient-to-br from-[var(--primary-color)] via-[#3a1053] to-[var(--bg-color)] border-b-4 border-[var(--secondary-color)] relative">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 md:mb-4 tracking-wide drop-shadow-lg transition duration-700 animate-fade-in" style={{ fontFamily: 'Cinzel Decorative, serif', textAlign: 'center' }}>{t('header_title')}</h1>
        <p className="text-lg sm:text-xl md:text-2xl text-[var(--text-muted-color)] mb-8 md:mb-10 max-w-2xl tracking-wider text-center" style={{ fontFamily: 'Cinzel Decorative, serif' }}>{t('header_subtitle')}</p>
        <Button href={`/reading`} variant="primary" size="lg" className={`transition-all duration-1000 ease-out delay-400 ${headerVisible ? 'opacity-100 translate-y-0 scale-100 shadow-[0_0_24px_4px_var(--highlight-color)]' : 'opacity-0 translate-y-8 scale-90 blur-sm'} animate-fade-in`}>
          <span role="img" aria-label="sparkles" className="mr-2">✨</span>
          {t('start_journey')}
        </Button>
      </header>
    </>
  );
} 