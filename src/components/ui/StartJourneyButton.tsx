import React from "react";
import Link from "next/link";

interface StartJourneyButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function StartJourneyButton({ href, onClick, className = "", children }: StartJourneyButtonProps) {
  const base =
    "inline-flex items-center justify-center font-bold px-8 py-4 bg-gradient-to-r from-[#2a1746] via-[#5e3ca4] to-[#00c6fb] text-white shadow-[0_4px_32px_0_rgba(94,60,164,0.25)] border-2 border-[#3a2560] rounded-xl transition-all duration-300 hover:brightness-110 hover:scale-105 hover:shadow-[0_6px_40px_0_rgba(0,198,251,0.25)] focus:ring-2 focus:ring-[#00c6fb] text-lg gap-2";
  const content = (
    <>
      <span role="img" aria-label="sparkles" className="drop-shadow-lg">✨</span>
      {children || "Start Journey"}
    </>
  );
  if (href) {
    return (
      <Link href={href} prefetch={true} className={`${base} ${className}`}>{content}</Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={`${base} ${className}`}>
      {content}
    </button>
  );
} 