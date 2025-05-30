import React from 'react';
import Button from './button';
import { SunIcon, MoonIcon } from '@/assets/icons';

// Theme toggle is disabled since ThemeProvider is removed
export function ThemeToggle() {
  return (
    <Button
      variant="ghost"
      size="icon"
      title="Theme switching disabled"
      disabled
    >
      <span className="sr-only">Theme switching disabled</span>
      <SunIcon className="w-5 h-5 opacity-40" />
    </Button>
  );
} 