import React from "react";

export default function SectionHeading({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={`text-3xl md:text-4xl font-cinzel font-semibold tracking-wide text-highlight-color mb-6 transition-transform transition-shadow duration-200 hover:scale-105 hover:shadow-lg ${className}`}
    >
      {children}
    </h2>
  );
} 