import { fmt, fmtInt } from "../utils/formatters";

interface PriceProps {
  /** Upgrade delta — shows "+ A$X" or "Included". */
  p?: number;
  /** Shows "From A$X" when the card represents a product tier. */
  fromTotal?: number;
}

/** Right-aligned price label used inside OptionCard rows. */
export function Price({ p, fromTotal }: PriceProps) {
  const base = "text-[13px] whitespace-nowrap ml-3 shrink-0 tracking-[-0.015em]";

  if (fromTotal !== undefined) {
    return <span className={`${base} text-t1 font-semibold mt-auto mb-auto`}>From {fmtInt(fromTotal)}</span>;
  }

  const val = p ?? 0;
  return (
    <span className={`${base} ${val > 0 ? "text-t1 font-semibold mt-auto mb-auto" : "text-t2 font-semibold mt-auto mb-auto"}`}>
      {val === 0 ? "Included" : `+ ${fmt(val)}`}
    </span>
  );
}