interface HeroPill {
    label:    string;
    onClick?: () => void;
  }
  
  interface HeroProps {
    badge?:        string;
    title:         string;
    /** Fixed lines displayed beneath the title (e.g. availability copy). */
    subtitles?:    string[];
    /** Dynamic price line — pass a pre-formatted string. */
    priceDisplay:  string;
    /** Desktop-only secondary action pills. */
    pills?:        HeroPill[];
    isMobile:      boolean;
  }
  
  /**
   * Product hero: badge, title, subtitle lines, live price and optional
   * pill-shaped secondary action buttons (trade-in, financing, etc.).
   */
  export function Hero({ badge, title, subtitles, priceDisplay, pills, isMobile }: HeroProps) {
    return (
      <div
        className={[
          "border-b border-border flex",
          isMobile
            ? "flex-col pt-7 px-5 pb-6"
            : "flex-row justify-between items-start pt-10 px-16 pb-9",
        ].join(" ")}
      >
        <div>
          {badge && (
            <p className="text-sm font-semibold text-t2 mb-2 tracking-[0.005em]">{badge}</p>
          )}
          <h1
            className={[
              "font-bold text-t1 mb-3 leading-[1.1]",
              isMobile ? "text-[32px]" : "text-[40px]",
            ].join(" ")}
          >
            {title}
          </h1>
          {subtitles?.map((line, i) => (
            <p key={i} className="text-[15px] text-t2 mb-[3px] tracking-[-0.01em]">
              {line}
            </p>
          ))}
          <p className="text-[15px] font-medium text-t1 mb-3 tracking-[-0.005em]">
            {priceDisplay}
          </p>
        </div>
  
        {!isMobile && pills && pills.length > 0 && (
          <div className="flex flex-col gap-[10px] mt-1">
            {pills.map((pill, i) => (
              <button key={i} onClick={pill.onClick} className="pill-btn">
                {pill.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }