"use client";
import dynamic from "next/dynamic";

const BackgroundLottie = dynamic(() => import("./BackgroundLottie"), {
  ssr: false,
});

export default BackgroundLottie; 