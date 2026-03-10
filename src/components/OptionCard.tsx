import React, { useState, useRef, useEffect } from "react";

interface OptionCardProps {
  selected:  boolean;
  onClick?:  () => void;
  children:  React.ReactNode;
  disabled?: boolean;
}

/**
 * Generic selectable card used for every choosable option (size, chip,
 * variant, memory, storage).  Border colour reflects selected / hover /
 * default state; everything else comes from the `.option-card` @apply class.
 */
export function OptionCard({ selected, onClick, children, disabled }: OptionCardProps) {
  const [hov, setHov] = useState(false);

  const borderColour = selected
    ? "border-brand"
    : hov
    ? "border-[#b0b0b5]"
    : "border-border";

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => { if (!disabled) setHov(true);  }}
      onMouseLeave={() => { if (!disabled) setHov(false); }}
      className={`option-card ${borderColour} ${disabled ? "opacity-45 cursor-default" : "cursor-pointer"}`}
    >
      {children}
    </button>
  );
}