interface ScrollHeaderProps {
    title:         string;
    priceDisplay:  string;
    /** Optional delivery copy (hidden on mobile). */
    deliveryLabel?: string;
    deliveryTime?:  string;
    isMobile:      boolean;
  }
  
  /**
   * Sticky top bar that slides in once the hero scrolls out of view.
   * Pass a pre-formatted `priceDisplay` string so the component stays
   * decoupled from any product-specific formatter logic.
   */
  export function ScrollHeader({
    title,
    priceDisplay,
    deliveryLabel = "Pickup:",
    deliveryTime  = "6-hour delivery (Free)",
    isMobile,
  }: ScrollHeaderProps) {
    return (
      <div className="sticky top-0 z-[200] bg-white/[0.95] backdrop-blur-[20px] border-b border-border h-[55px] flex items-center justify-between px-5 animate-hdr-slide">
        <span className="text-[18px] font-semibold text-t1">{title}</span>
  
        <div className={`flex items-center ${isMobile ? "gap-3" : "gap-5"}`}>
          {!isMobile && (
            <>
              <span className="text-[14px] font-medium text-t2">
                {deliveryLabel}{" "}
                <span className="text-t1 font-semibold">Available</span>
              </span>
              <span className="text-[14px] text-t1 font-semibold">{deliveryTime}</span>
            </>
          )}
          <span className="text-base font-bold text-t1 tracking-[-0.01em]">
            {priceDisplay}
          </span>
        </div>
      </div>
    );
  }