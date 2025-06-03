"use client";
import { motion } from "framer-motion";
import * as React from "react";

export default function UnveilButton({ onClick, disabled = false, label, backgroundImage, style }: { onClick?: () => void; disabled?: boolean; label?: string; backgroundImage?: string; style?: React.CSSProperties }) {
  return (
    <motion.button
      className={`
        relative w-full max-w-xl aspect-[4/1.3] rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-xl
        focus:outline-none focus:ring-2 focus:ring-yellow-300
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
      `}
      style={{
        background: `url(${backgroundImage || "/images/buttons/cardRevealButton_img.jpg"}) center/cover no-repeat`,
        minWidth: 320,
        minHeight: 100,
        ...style
      }}
      whileHover={!disabled ? { scale: 1.04, boxShadow: "0 0 32px #FFD700, 0 0 64px #3B006A" } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={disabled ? undefined : onClick}
      aria-label={label || "Unveil the Stars"}
      disabled={disabled}
    >
      {label && (
        <span
          className="absolute inset-0 flex items-center justify-center text-xl font-bold select-none pointer-events-none w-full h-full text-center break-words"
          style={{ fontFamily: 'Cinzel Decorative, serif', color: '#fff', textShadow: '0 2px 8px #1a0026, 0 0 8px #ffd700, 0 0 2px #000' }}
        >
          {label}
        </span>
      )}
      <span className="sr-only">{label || "Unveil the Stars"}</span>
    </motion.button>
  );
}