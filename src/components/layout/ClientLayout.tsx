"use client";
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
// import BackgroundLottie from "@/components/layout/BackgroundLottieDynamic";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a0a23] via-[#1a103b] to-[#3a0a1a]">
      {/* <BackgroundLottie /> */}
      <Navbar headerVisible={true} />
      <main className="flex-1 w-full flex flex-col items-center justify-start">
        {children}
      </main>
      <Footer />
    </div>
  );
} 