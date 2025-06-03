"use client"; // Bu bileşenin istemci tarafında çalışması gerektiğini belirtiyoruz
import React, { useState, useEffect } from "react";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    // Bileşen istemcide yüklendikten sonra yılı ayarla
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-gradient-to-t from-[#0a0a23] via-[#1a103b] to-[#3a0a1a] text-[var(--text-muted-color)]/80 text-center py-8 md:py-10 px-4 md:px-6 mt-10 md:mt-16 text-sm">
      <p className="mb-1">&copy; {currentYear ? currentYear : '2024'} Astral Tarot. All rights reserved.</p>
      <p>For entertainment and self-exploration purposes only.</p>
    </footer>
  );
}