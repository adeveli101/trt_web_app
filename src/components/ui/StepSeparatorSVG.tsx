import React from "react";
export function StepSeparatorSVG({ vertical = false }: { vertical?: boolean }) {
  return vertical ? (
    <svg width="8" height="56" viewBox="0 0 8 56" fill="none">
      <path d="M4 4 Q 7 28 4 52" stroke="url(#step-separator-gradient)" strokeWidth="2.5" strokeLinecap="round">
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,1; 0,0; 0,-1; 0,0" keyTimes="0;0.25;0.5;0.75;1" dur="3.5s" repeatCount="indefinite" />
      </path>
      <defs>
        <linearGradient id="step-separator-gradient" x1="4" y1="0" x2="4" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1a0008" stopOpacity="0.1" />
          <stop offset="0.25" stopColor="#2c0018" stopOpacity="0.7" />
          <stop offset="0.5" stopColor="#6a003a" stopOpacity="1" />
          <stop offset="0.75" stopColor="#2c0018" stopOpacity="0.7" />
          <stop offset="1" stopColor="#1a0008" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  ) : (
    <svg width="56" height="8" viewBox="0 0 56 8" fill="none">
      <path d="M4 4 Q 28 7 52 4" stroke="url(#step-separator-gradient)" strokeWidth="2.5" strokeLinecap="round">
        <animateTransform attributeName="transform" type="translate" values="0,0; 1,0; 0,0; -1,0; 0,0" keyTimes="0;0.25;0.5;0.75;1" dur="3.5s" repeatCount="indefinite" />
      </path>
      <defs>
        <linearGradient id="step-separator-gradient" x1="0" y1="4" x2="56" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1a0008" stopOpacity="0.1" />
          <stop offset="0.25" stopColor="#2c0018" stopOpacity="0.7" />
          <stop offset="0.5" stopColor="#6a003a" stopOpacity="1" />
          <stop offset="0.75" stopColor="#2c0018" stopOpacity="0.7" />
          <stop offset="1" stopColor="#1a0008" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  );
} 