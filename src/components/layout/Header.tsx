"use client";
import React from 'react';
import Button from '../ui/button';
import { ThemeToggle } from '../ui/theme-toggle';
import { LogoIcon } from '@/assets/icons';
import { Menu } from '@headlessui/react';
import { HiOutlineMenu } from 'react-icons/hi';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[var(--bg-color)] via-[var(--primary-color)] to-[var(--bg-color)] backdrop-blur-md backdrop-saturate-150 shadow-[0_0_15px_rgba(26,16,59,0.3)] transition-all duration-300 ease-in-out">
      <img src="/images/nebula_overlay.png" alt="nebula" className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none z-0" />
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6 relative z-10">
          <a href="/" className="flex items-center gap-2 text-xl font-bold text-white" style={{ textShadow: '0 0 8px rgba(58,10,26,0.7)' }}>
            <img src="/images/logo_at.png" alt="Astral Tarot Logo" className="w-10 h-10 object-contain" style={{ filter: 'drop-shadow(0 0 8px var(--accent-color))' }} />
            <span className="tracking-wider font-cinzel" style={{ fontFamily: 'Cinzel Decorative, serif' }}>Astral Tarot</span>
          </a>
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <ThemeToggle />
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="inline-flex justify-center items-center w-10 h-10 rounded-full bg-[var(--accent-color)]/10 hover:bg-[var(--accent-color)]/20 text-[var(--accent-color)] transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] shadow-none hover:shadow-[0_0_12px_rgba(58,10,26,0.5)]">
              <HiOutlineMenu className="w-6 h-6" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-[var(--card-bg-color)]/90 shadow-2xl shadow-[var(--bg-color)]/70 border border-[var(--secondary-color)]/30 focus:outline-none z-50">
              <div className="py-1">
                <Menu.Item>
                  {({ active }: { active: any }) => (
                    <a
                      href="#profile"
                      className={`block px-4 py-2 text-sm transition-all duration-300 ease-in-out ${active ? 'bg-[var(--accent-color)]/10 text-white' : 'text-[var(--text-muted-color)]'}`}
                    >
                      Profilim
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }: { active: any }) => (
                    <a
                      href="#settings"
                      className={`block px-4 py-2 text-sm transition-all duration-300 ease-in-out ${active ? 'bg-[var(--accent-color)]/10 text-white' : 'text-[var(--text-muted-color)]'}`}
                    >
                      Ayarlar
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }: { active: any }) => (
                    <button
                      type="button"
                      className={`block w-full text-left px-4 py-2 text-sm transition-all duration-300 ease-in-out ${active ? 'bg-[var(--accent-color)]/10 text-white' : 'text-[var(--text-muted-color)]'}`}
                    >
                      Çıkış
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </header>
  );
} 