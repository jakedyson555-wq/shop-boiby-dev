import React, { useState, useRef, useEffect } from "react";
import { SummaryTeaser }       from "../components/SummaryTeaser";
import { SummarySpecCard }     from "../components/SummarySpecCard";
import { SummaryPriceBlock }   from "../components/SummaryPriceBlock";
import type { SpecGroup }      from "../components/SummarySpecCard";

interface SummaryProps {
  allDone: boolean;

  /* ── Teaser copy (shown while incomplete) ─────────────────────────── */
  teaserHeadline?: string;
  teaserSubline?:  string;

  /* ── Header copy (shown when complete) ───────────────────────────── */
  headline?: string;
  subline?:  string;

  /* ── Spec card ───────────────────────────────────────────────────── */
  productName?: string;
  colorName?:   string;
  specGroups?:  SpecGroup[];

  /* ── Price block ─────────────────────────────────────────────────── */
  total?:        number;
  gst?:          number;
  deliveryText?: string;

  /* ── CTA ─────────────────────────────────────────────────────────── */
  ctaLabel?:     string;
  ctaDoneLabel?: string;
  onCta?:        () => void;

  isMobile: boolean;
}

/**
 * Summary section — assembled from three generic sub-components.
 * All product-specific strings and spec data come in as props from the
 * root configurator; this section itself has no product knowledge.
 *
 * Sub-components can also be used independently:
 *   import { SummarySpecCard }   from "../components/SummarySpecCard"
 *   import { SummaryPriceBlock } from "../components/SummaryPriceBlock"
 *   import { SummaryTeaser }     from "../components/SummaryTeaser"
 */
export function Summary({
  allDone,
  teaserHeadline = "Your new product awaits.",
  teaserSubline  = "Customise it and make it yours.",
  headline       = "Your new product.",
  subline        = "Everything look good?",
  productName    = "",
  colorName      = "",
  specGroups     = [],
  total          = 0,
  gst            = 0,
  deliveryText,
  ctaLabel       = "Continue",
  ctaDoneLabel   = "Added to Bag",
  onCta,
  isMobile,
}: SummaryProps) {
  const [done, setDone] = useState(false);
  const padClass = isMobile ? "pt-12 pb-20" : "pt-24 pb-20";

  if (!allDone) {
    return (
      <SummaryTeaser
        headline={teaserHeadline}
        subline={teaserSubline}
        isMobile={isMobile}
      />
    );
  }

  const handleCta = () => {
    setDone(true);
    onCta?.();
    setTimeout(() => setDone(false), 2400);
  };

  return (
    <div className={padClass}>
      <p className="text-[24px] font-semibold text-t1 tracking-[-0.01em] leading-[1.25]">
        {headline}
      </p>
      <p className="text-[24px] font-semibold text-t2 mb-6 tracking-[-0.01em] leading-[1.25]">
        {subline}
      </p>

      <SummarySpecCard
        productName={productName}
        colorName={colorName}
        specGroups={specGroups}
      />

      <SummaryPriceBlock
        total={total}
        gst={gst}
        deliveryText={deliveryText}
      />

      <button
        onClick={handleCta}
        className={`cta-btn ${done ? "!bg-[#34a853]" : ""}`}
      >
        {done ? ctaDoneLabel : ctaLabel}
      </button>
    </div>
  );
}