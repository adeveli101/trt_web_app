import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 w-full bg-gradient-to-br from-[#0a0a23] via-[#1a103b] to-[#3a0a1a] rounded-2xl shadow-xl py-8 md:py-12">
      {children}
    </div>
  );
} 