"use client";
import { useRouter, usePathname } from 'next/navigation';
import { useParams } from 'next/navigation';
import React, { useState, useRef, useEffect } from 'react';

const languages = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'tr', label: 'Türkçe', short: 'TR' },
  { code: 'de', label: 'Deutsch', short: 'DE' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'it', label: 'Italiano', short: 'IT' },
];

export default function LanguageSwitcher({ small = false }: { small?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as string;
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === currentLocale) || languages[0];

  // Kapanma için dışarı tıklama
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        sheetRef.current &&
        !sheetRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  function handleSelect(code: string) {
    setOpen(false);
    if (code === currentLocale) return;
    const segments = pathname.split('/');
    segments[1] = code;
    const newPath = segments.join('/') || '/';
    router.push(newPath);
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1 ${small ? 'px-2 py-1 min-w-[36px] text-xs rounded-md' : 'px-3 py-1.5 min-w-[60px] text-sm rounded-lg'} border-2 transition font-bold select-none
          ${open ? 'border-[var(--accent-color)] bg-gradient-to-r from-[#2a1746] to-[var(--accent-color)] text-[var(--accent-color)] shadow-lg' : 'border-[var(--accent-color)] bg-gradient-to-r from-[#2a1746] to-[var(--accent-color)] text-white hover:brightness-110 hover:shadow-lg'}
        `}
        aria-haspopup="listbox"
        aria-expanded={open}
        type="button"
        style={{ boxShadow: open ? '0 0 0 2px var(--accent-color)' : undefined }}
      >
        <span className="font-bold mr-1 tracking-wide">{currentLang.short}</span>
      </button>
      {open && (
        <div
          ref={sheetRef}
          className={`absolute right-0 mt-2 z-50 ${small ? 'min-w-[100px] py-1' : 'min-w-[140px] py-2'} bg-gradient-to-br from-[#2a1746] to-[var(--accent-color)] border-2 border-[var(--accent-color)] rounded-xl shadow-2xl animate-fade-in-up-scale`}
        >
          {languages.map(lng => (
            <button
              key={lng.code}
              onClick={() => handleSelect(lng.code)}
              className={`flex items-center w-full ${small ? 'px-2 py-1 text-xs rounded-md' : 'px-4 py-2 text-sm rounded-lg'} gap-2 text-left transition
                ${lng.code === currentLocale
                  ? 'bg-gradient-to-r from-[#3a2560] to-[var(--accent-color)] text-white font-bold shadow'
                  : 'text-white/80 hover:bg-[var(--accent-color)]/30 hover:text-white'}
              `}
              role="option"
              aria-selected={lng.code === currentLocale}
              tabIndex={0}
            >
              <span className="font-bold w-8 tracking-wide">{lng.short}</span>
              {!small && <span className="text-base">{lng.label}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 