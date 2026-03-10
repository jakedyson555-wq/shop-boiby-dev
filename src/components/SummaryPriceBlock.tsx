import { fmt } from "../utils/formatters";

interface SummaryPriceBlockProps {
  total:         number;
  gst:           number;
  /** Shown below the GST line. Defaults to a generic pickup/delivery message. */
  deliveryText?: string;
}

/**
 * Displays the formatted total price, an approximate GST breakdown,
 * and a short delivery/pickup message.
 * Fully generic — pass any `total` / `gst` values and optional copy.
 */
export function SummaryPriceBlock({
  total,
  gst,
  deliveryText = "Pick up tomorrow at a store near you or get it delivered",
}: SummaryPriceBlockProps) {
  return (
    <div className="mb-[24px]">
      <p className="text-[30px] font-semibold text-t1 mb-[4px] tracking-[-0.005em]">
        {fmt(total)}
      </p>
      <p className="text-[14px] text-[#3a3a3c] font-semibold mb-[6px]">
        Includes GST of approx. {fmt(gst)}
      </p>
      <p className="text-[14px] text-t2 font-medium leading-[1.4]">
        {deliveryText}
      </p>
    </div>
  );
}