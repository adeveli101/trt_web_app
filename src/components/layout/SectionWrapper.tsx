import React, { forwardRef } from "react";
import { Separator } from "@/components/ui/separator";
import clsx from "clsx";

const SectionWrapper = forwardRef<HTMLDivElement, {
  children: React.ReactNode;
  showSeparator?: boolean;
  className?: string;
  minHeight?: string;
}>(({ children, showSeparator = true, className = "", minHeight = "min-h-[60vh]" }, ref) => (
  <>
    <section
      ref={ref}
      className={clsx(
        'relative w-full flex flex-col items-center justify-center',
        'bg-card-bg-color/60 backdrop-blur-md shadow-xl',
        minHeight,
        className
      )}
    >
      {children}
    </section>
    {showSeparator && (
      <Separator className="w-full mt-12 mb-0 opacity-90 border-none h-1 bg-gradient-to-r from-[var(--highlight-color)] to-[var(--accent-color)]" />
    )}
  </>
));
export default SectionWrapper; 