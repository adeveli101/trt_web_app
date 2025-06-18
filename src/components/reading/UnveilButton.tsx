"use client";
import { motion } from "framer-motion";
import * as React from "react";

export default function UnveilButton({ onClick, disabled = false, label, backgroundImage, style }: { onClick?: () => void; disabled?: boolean; label?: string; backgroundImage?: string; style?: React.CSSProperties }) {
  return (
    <motion.button
      className={`
        relative w-full max-w-xl aspect-[4/1.3] rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-xl
        focus:outline-none focus:ring-2 focus:ring-yellow-300
        ${disabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-[0_0_32px_0_rgba(255,215,0,0.4)]"}
        transition-all duration-200
      `}
      style={{
        background: `url(${backgroundImage || "/images/buttons/cardRevealButton_img.jpg"}) center/cover no-repeat`,
        minWidth: 240,
        minHeight: 56,
        padding: '0.5rem 1.5rem',
        ...style
      }}
      whileHover={!disabled ? { scale: 1.045, boxShadow: "0 0 32px #FFD700, 0 0 64px #3B006A" } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={disabled ? undefined : onClick}
      aria-label={label || "Unveil the Stars"}
      disabled={disabled}
    >
      {label && (
        <span
          className="absolute inset-0 flex items-center justify-center w-full h-full pointer-events-none"
        >
          <span className="absolute inset-x-4 top-1/2 -translate-y-1/2 bg-black/40 rounded-xl w-auto h-auto min-w-[60%] min-h-[2.5rem]" aria-hidden="true"></span>
          <span
            className="relative z-10 font-bold text-center break-words px-2 py-1 select-none text-base md:text-lg lg:text-xl leading-tight"
            style={{ fontFamily: 'Cinzel Decorative, serif', color: '#fff', textShadow: '0 2px 8px #1a0026, 0 0 8px #ffd700, 0 0 2px #000' }}
          >
            {label}
          </span>
        </span>
      )}
      <span className="sr-only">{label || "Unveil the Stars"}</span>
    </motion.button>
  );
}