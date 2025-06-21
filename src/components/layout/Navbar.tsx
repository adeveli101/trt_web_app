"use client";
import React, { useState, useEffect } from "react"; // useState ve useEffect'i import ettiğinizden emin olun
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from 'next-intl';
import Button from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";

const NAV_ITEMS = [
  { label: 'about', href: '#about' },
  { label: 'features', href: '#features' },
];

export default function Navbar({ headerVisible }: { headerVisible: boolean }) {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = useTranslations();

  const [active, setActive] = useState('');
  const [hasMounted, setHasMounted] = useState(false); // Yeni state

  useEffect(() => {
    setHasMounted(true); // Bileşen istemcide yüklendi
    const onScroll = () => {
      const scrollY = window.scrollY;
      let found = '';
      NAV_ITEMS.forEach(item => {
        const el = document.querySelector(item.href);
        if (el && (el as HTMLElement).offsetTop - 80 <= scrollY) {
          found = item.label;
        }
      });
      setActive(found);
    };

    window.addEventListener('scroll', onScroll);
    onScroll(); // İlk çağrı

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[var(--bg-color)] via-[var(--primary-color)] to-[var(--bg-color)]/90 backdrop-blur-md shadow-md h-[var(--navbar-height-mobile)] md:h-[var(--navbar-height)] flex items-center">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between w-full h-full">
        {/* Sol blok: Brand + Nav */}
        <div className="flex items-center gap-2 md:gap-8">
          <Link href={`/${locale}`} prefetch className="flex items-center gap-2 text-xl md:text-2xl font-extrabold text-white tracking-wider focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] bg-transparent border-0 cursor-pointer" aria-label={t('brand')} tabIndex={0}>
            <img src="/images/logo_at.png" alt="Astral Tarot Logo" className="w-14 h-14 object-contain rounded-full" style={{ filter: 'drop-shadow(0 0 8px var(--accent-color))' }} />
            <span className="hidden sm:inline drop-shadow-lg">{t('brand')}</span>
          </Link>
          <div className="hidden md:flex items-center gap-2 md:gap-6 ml-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                // hasMounted kontrolü ekleyerek CSS sınıfının sadece istemcide uygulanmasını sağlıyoruz
                className={`px-3 py-2 text-base md:text-lg font-semibold rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] ${hasMounted && active === item.label ? 'text-white font-bold' : 'text-white/90 hover:bg-[var(--accent-color)]/30 hover:text-white'}`}
              >
                {t(item.label)}
              </a>
            ))}
          </div>
        </div>
        {/* Orta boşluk (grow) */}
        <div className="flex-1" />
        {/* Sağ blok: Start Journey + LanguageSwitcher */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link href={`/${locale}/reading`} prefetch className="group relative bg-gradient-to-r from-[#3a1053] to-[var(--accent-color)] text-white font-bold shadow-lg transition-all duration-300 w-10 h-10 md:w-10 md:h-10 overflow-hidden flex justify-center items-center px-0 hover:w-44 focus:w-44 rounded-full md:rounded-md" style={{ minWidth: 40, minHeight: 40, transitionProperty: 'width,background' }} tabIndex={0}>
            <span
              className="flex items-center h-full whitespace-nowrap text-base font-bold text-white transition-all duration-300 px-4
                absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none
                group-hover:static group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:ml-2
                group-focus:static group-focus:translate-x-0 group-focus:translate-y-0 group-focus:opacity-100 group-focus:pointer-events-auto group-focus:ml-2"
              style={{ pointerEvents: 'none' }}
            >
              {t('start_journey')}
            </span>
            <span role="img" aria-label="sparkles" className="text-lg md:text-xl transition-transform duration-300 group-hover:scale-125 group-focus:scale-125 z-10 ml-0 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">✨</span>
          </Link>
          {/* Küçük LanguageSwitcher */}
          <LanguageSwitcher small />
          {/* Mobil hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gradient-to-br from-[#2a1746] to-[var(--bg-color)] border-l-2 border-[var(--accent-color)] pt-8">
                <div className="flex flex-col gap-6">
                  <div className="mb-2">
                    <LanguageSwitcher small />
                  </div>
                  <div className="flex flex-col gap-2">
                    {NAV_ITEMS.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className="justify-start text-lg text-[var(--text-muted-color)] hover:text-white hover:bg-[var(--accent-color)]/20 rounded-md px-3 py-2"
                      >
                        {t(item.label)}
                      </a>
                    ))}
                  </div>
                  <Link href={`/${locale}/reading`} prefetch className="bg-gradient-to-r from-[var(--secondary-color)] to-[var(--accent-color)] text-white font-bold shadow-lg mt-4 flex items-center justify-center px-4 py-2 rounded-md">
                    <span role="img" aria-label="sparkles" className="mr-2">✨</span>
                    {t('start_journey')}
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}