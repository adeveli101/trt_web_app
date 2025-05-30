"use client";
import { motion } from "framer-motion";
import * as React from "react";

export default function UnveilButton({ onClick, disabled = false, label }: { onClick?: () => void; disabled?: boolean; label?: string }) {
  return (
    <motion.button
      className={`
        relative w-full max-w-xl aspect-[4/1.3] rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-xl
        focus:outline-none focus:ring-2 focus:ring-yellow-300
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
      `}
      style={{
        background: "url(/images/unveilTheStars_btn.png) center/cover no-repeat",
        minWidth: 320,
        minHeight: 100,
      }}
      whileHover={!disabled ? { scale: 1.04, boxShadow: "0 0 32px #FFD700, 0 0 64px #3B006A" } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={disabled ? undefined : onClick}
      aria-label={label || "Unveil the Stars"}
      disabled={disabled}
    >
      {label && (
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white drop-shadow-lg select-none pointer-events-none">
          {label}
        </span>
      )}
      <span className="sr-only">{label || "Unveil the Stars"}</span>
    </motion.button>
  );
}