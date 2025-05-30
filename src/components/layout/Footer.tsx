import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[var(--primary-color)] text-[var(--text-muted-color)]/70 text-center py-8 md:py-10 px-4 md:px-6 mt-10 md:mt-16 text-sm border-t border-[var(--secondary-color)]/30">
      <p className="mb-1">&copy; {new Date().getFullYear()} Astral Tarot. All rights reserved.</p>
      <p>For entertainment and self-exploration purposes only.</p>
    </footer>
  );
} 