"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function ContinueButton({ to, children }: { to: string, children: React.ReactNode }) {
  const router = useRouter();
  return (
    <button
      className="mt-8 px-6 py-3 bg-accent-gold text-black rounded font-bold hover:bg-yellow-400 transition"
      onClick={() => router.push(to)}
    >
      {children}
    </button>
  );
} 