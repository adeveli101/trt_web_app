"use client";
import React from 'react';
import { Button } from '../ui/button';
import { ThemeToggle } from '../ui/theme-toggle';
import { LogoIcon } from '@/assets/icons';
import { Menu } from '@headlessui/react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <LogoIcon className="w-6 h-6" />
            Astral Tarot
          </a>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="inline-flex justify-center items-center w-10 h-10 rounded-full bg-accent/10 hover:bg-accent/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              <LogoIcon className="w-6 h-6 text-primary" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-background shadow-lg ring-1 ring-black/5 focus:outline-none z-50 border border-border">
              <div className="py-1">
                <Menu.Item>
                  {({ active }: { active: any }) => (
                    <a
                      href="#profile"
                      className={`block px-4 py-2 text-sm ${active ? 'bg-accent/10 text-accent-foreground' : 'text-primary'}`}
                    >
                      Profilim
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }: { active: any }) => (
                    <a
                      href="#settings"
                      className={`block px-4 py-2 text-sm ${active ? 'bg-accent/10 text-accent-foreground' : 'text-primary'}`}
                    >
                      Ayarlar
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }: { active: any }) => (
                    <button
                      type="button"
                      className={`block w-full text-left px-4 py-2 text-sm ${active ? 'bg-accent/10 text-accent-foreground' : 'text-primary'}`}
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