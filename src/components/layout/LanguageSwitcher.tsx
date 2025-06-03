"use client";
import { useRouter, usePathname } from 'next/navigation';
import React, { useState, useRef, useEffect } from 'react';

const languages = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'de', label: 'Deutsch', short: 'DE' },
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'it', label: 'Italiano', short: 'IT' },
  { code: 'tr', label: 'Türkçe', short: 'TR' },
];

const defaultLocale = 'en';

export default function LanguageSwitcher({ small = false }: { small?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function handleSelect(code: string) {
    setIsOpen(false);
    const segments = pathname.split('/');
    // Remove locale prefix if present
    if (languages.some(l => l.code === segments[1])) {
      segments.splice(1, 1); // /de/xyz -> /xyz
    }
    // Always add the locale prefix, even for 'en'
    segments.splice(1, 0, code); // /xyz -> /en/xyz or /de/xyz
    let newPath = segments.join('/');
    newPath = newPath.replace(/\/+/g, '/');
    console.log('Switching to:', code, 'Current:', pathname, 'New:', newPath);
    if (pathname !== newPath) {
      router.replace(newPath);
    } else {
      router.refresh();
    }
  }

  // Aktif dili path'ten bul
  const currentLocale = (() => {
    const seg = pathname.split('/')[1];
    return languages.some(l => l.code === seg) ? seg : defaultLocale;
  })();
  const currentLang = languages.find(l => l.code === currentLocale) || languages[0];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`flex items-center gap-1 ${small ? 'px-2 py-1 min-w-[36px] text-xs rounded-md' : 'px-3 py-1.5 min-w-[60px] text-sm rounded-lg'} transition font-bold select-none
          bg-gradient-to-r from-[#0a0a23] via-[#1a103b] to-[#3a0a1a] text-white hover:brightness-110 hover:shadow-lg`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        type="button"
      >
        <span className="font-bold mr-1 tracking-wide text-white drop-shadow-glow text-base">{currentLang.short}</span>
      </button>
      {isOpen && (
        <div className={`absolute right-0 mt-2 z-50 ${small ? 'min-w-[100px] py-1' : 'min-w-[140px] py-2'} bg-gradient-to-br from-[#0a0a23] via-[#1a103b] to-[#3a0a1a] rounded-xl shadow-2xl animate-fade-in-up-scale`}>
          {languages.map(lng => (
            <button
              key={lng.code}
              onClick={() => handleSelect(lng.code)}
              className={`flex items-center w-full ${small ? 'px-2 py-1 text-xs rounded-md' : 'px-4 py-2 text-sm rounded-lg'} gap-2 text-left transition
                ${lng.code === currentLocale
                  ? 'bg-gradient-to-r from-[#1a103b] to-[#3a0a1a] text-white font-bold shadow'
                  : 'text-white/80 hover:bg-[#3a0a1a]/30 hover:text-white'}
              `}
              role="option"
              aria-selected={lng.code === currentLocale}
              tabIndex={0}
            >
              <span className="font-bold w-8 tracking-wide text-base">{lng.short}</span>
              {!small && <span className="text-base">{lng.label}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 