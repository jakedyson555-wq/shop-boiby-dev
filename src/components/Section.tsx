import { RefObject } from "react";

interface SectionProps {
  refProp?:  RefObject<HTMLDivElement>;
  children:  React.ReactNode;
  locked?:   boolean;
  isMobile:  boolean;
}

/**
 * Full-viewport-height wrapper for each configuration step.
 * Locked sections (not yet reached) fade to 38 % opacity and block interaction.
 */
export function Section({ refProp, children, locked, isMobile }: SectionProps) {
  return (
    <div
      ref={refProp}
      className={[
        "config-section",
        isMobile
          ? "min-h-[70vh] px-3"
          : "min-h-screen",
        locked ? "opacity-[0.38] pointer-events-none" : "opacity-100",
      ].join(" ")}
    >
      {children}
    </div>
  );
}