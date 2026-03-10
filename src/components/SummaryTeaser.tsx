interface SummaryTeaserProps {
    /** Bold first line. */
    headline:  string;
    /** Muted second line. */
    subline:   string;
    isMobile:  boolean;
  }
  
  /**
   * Shown in the summary area before the user has finished configuring.
   * Passes product-specific copy in as props so the component is generic.
   */
  export function SummaryTeaser({ headline, subline, isMobile }: SummaryTeaserProps) {
    const padClass = isMobile ? "px-5 pt-20 pb-20" : "pt-20 pb-20";
    return (
      <div className={padClass}>
        <p className="text-[24px] font-semibold text-t1 mb-1 tracking-[-0.01em] leading-[1.25]">
          {headline}
        </p>
        <p className="text-[24px] font-semibold text-t2 m-0 tracking-[-0.01em] leading-[1.25]">
          {subline}
        </p>
      </div>
    );
  }