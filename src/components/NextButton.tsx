interface NextButtonProps {
    label:    string;
    onClick:  () => void;
    isMobile: boolean;
  }
  
  /**
   * Floating "Next step" button.
   * - Mobile: full-width bar pinned to the bottom of the viewport.
   * - Desktop: pill button anchored to the bottom-right corner.
   */
  export function NextButton({ label, onClick, isMobile }: NextButtonProps) {
    return (
      <div
        className={[
          "fixed z-[400] animate-next-btn-in",
          isMobile
            ? "bottom-0 left-0 right-0 px-4 pt-3 pb-5 bg-white/[0.95] backdrop-blur-[12px] border-t border-border"
            : "bottom-8 right-9",
        ].join(" ")}
      >
        <button
          onClick={onClick}
          className={[
            "flex items-center justify-center gap-[10px] py-[14px] px-[22px]",
            "rounded-full bg-t1 text-white border-none",
            "text-[15px] font-semibold cursor-pointer tracking-[-0.005em]",
            isMobile ? "w-full" : "w-auto",
          ].join(" ")}
        >
          {label}
          <span className="text-[18px] leading-none">→</span>
        </button>
      </div>
    );
  }