import dynamic from "next/dynamic";
const StepperBarClientWrapper = dynamic(() => import("./StepperBarClientWrapper"), { ssr: false });

export default function StepperBarServerWrapper(props: any) {
  return <StepperBarClientWrapper {...props} />;
} 