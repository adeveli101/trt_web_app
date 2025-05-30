"use client";
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
// import BackgroundLottie from "@/components/layout/BackgroundLottieDynamic";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <BackgroundLottie /> */}
      <Navbar headerVisible={true} />
      {children}
      <Footer />
    </>
  );
} 