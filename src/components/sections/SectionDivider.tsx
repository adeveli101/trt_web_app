import React from "react";

export default function SectionDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className="w-full overflow-hidden leading-none">
      <svg
        viewBox="0 0 1440 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-16 md:h-24 ${flip ? 'rotate-180' : ''}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="section-wave-gradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1a103b" />
            <stop offset="0.5" stopColor="#3a1053" />
            <stop offset="1" stopColor="#5e3ca4" />
          </linearGradient>
        </defs>
        <path
          d="M0,40 C360,120 1080,-40 1440,60 L1440,100 L0,100 Z"
          fill="url(#section-wave-gradient)"
          fillOpacity="0.95"
        />
      </svg>
    </div>
  );
} 