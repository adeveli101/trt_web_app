import React from "react";
import Link from "next/link";

interface StartJourneyButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function StartJourneyButton({ href, onClick, className = "", children }: StartJourneyButtonProps) {
  const base = `
    relative inline-flex items-center justify-center font-bold px-8 py-4
    bg-gradient-to-r from-[#2a1746] via-[#5e3ca4] to-[#00c6fb] text-white
    shadow-[0_4px_32px_0_rgba(94,60,164,0.25)] border-2 border-[#3a2560]
    rounded-2xl transition-all duration-300
    hover:brightness-110 hover:scale-105 hover:shadow-[0_6px_40px_0_rgba(0,198,251,0.25)]
    focus:ring-2 focus:ring-[#00c6fb] text-lg gap-2
    before:absolute before:inset-0 before:rounded-2xl before:z-0
    before:bg-[linear-gradient(120deg,#2a1746,40%,#5e3ca4,80%,#00c6fb)]
    before:opacity-60 before:blur-sm
    active:before:opacity-80
    overflow-hidden
    animate-gradient-move
  `;
  const gradientAnim = `
    @keyframes gradient-move {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animate-gradient-move {
      background-size: 200% 200%;
      animation: gradient-move 6s ease-in-out infinite;
    }
  `;
  const content = (
    <span style={{ fontFamily: 'Cinzel Decorative, serif', fontStyle: 'italic', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', color: '#fff', textShadow: '0 2px 8px #3a1053, 0 0 12px #ffd700' }}>
      <span role="img" aria-label="sparkles" className="drop-shadow-lg">✨</span>
      {children || "Start Journey"}
    </span>
  );
  return (
    <>
      <style>{gradientAnim}</style>
      {href ? (
        <Link href={href} prefetch={true} className={`${base} ${className}`} style={{ boxShadow: '0 0 24px 6px #5e3ca4, 0 2px 8px 0 #000 inset' }}>
          {content}
        </Link>
      ) : (
        <button type="button" onClick={onClick} className={`${base} ${className}`} style={{ boxShadow: '0 0 24px 6px #5e3ca4, 0 2px 8px 0 #000 inset' }}>
          {content}
        </button>
      )}
    </>
  );
} 