"use client";
import dynamic from "next/dynamic";
const StepperBarClientWrapper = dynamic(() => import("./StepperBarClientWrapper"), { ssr: false });

export default function StepperBarClientDynamicWrapper(props: any) {
  return <StepperBarClientWrapper {...props} />;
} 