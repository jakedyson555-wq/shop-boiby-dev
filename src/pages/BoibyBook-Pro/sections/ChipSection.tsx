import { RefObject } from "react";
import { Section }    from "../../../components/Section";
import { SecTitle }   from "../../../components/SecTitle";
import { OptionCard } from "../../../components/OptionCard";
import { Price }      from "../../../components/Price";
import type { SizeOption, ChipOption, ChipVariant } from "../../../types";

interface ChipSectionProps {
  refProp:         RefObject<HTMLDivElement>;
  availChips:      ChipOption[];
  selected:        ChipOption | null;
  chipVariant:     ChipVariant | null;
  size:            SizeOption | null;
  onSelectChip:    (c: ChipOption) => void;
  onSelectVariant: (v: ChipVariant) => void;
  locked:          boolean;
  isMobile:        boolean;
}

export function ChipSection({
  refProp, availChips, selected, chipVariant, size,
  onSelectChip, onSelectVariant, locked, isMobile,
}: ChipSectionProps) {
  return (
    <Section refProp={refProp} locked={locked} isMobile={isMobile}>
      <SecTitle bold="Chip." light="Choose from these powerful options." />

      <div className="flex flex-col gap-[10px]">
        {availChips.map(c => {
          const sel = selected === c;
          return (
            <div key={c.id}>
              <OptionCard selected={sel} onClick={() => onSelectChip(c)}>
                <div className="flex-1 min-w-0">
                  {c.badge && (
                    <div className="text-[15px] font-semibold text-accent-orange tracking-[0.005em]">
                      {c.badge}
                    </div>
                  )}
                  <div className="text-[18px] font-bold text-t1 mb-0.5 tracking-[-0.01em]">
                    {c.name}
                  </div>
                  <div className={`text-[13px] text-t1 font-semibold leading-[1.4] ${c.spec ? "mb-[2px]" : ""}`}>
                    {c.desc}
                  </div>
                  {c.spec && <div className="text-[12px] mt-1 font-medium text-t2">{c.spec}</div>}
                </div>
                <Price fromTotal={(size?.basePrice ?? 0) + c.basePrice} />
              </OptionCard>

              {/* Variant sub-panel (Pro / Max chips only) */}
              {sel && !c.isAuto && (
                <div className="variant-panel">
                  <p className="text-[16px] font-semibold text-t1 mb-[14px] tracking-[-0.012em]">
                    Select your processing power.
                  </p>
                  <div className="flex flex-col gap-2">
                    {c.variants.map(v => (
                      <OptionCard
                        key={v.id}
                        selected={chipVariant === v}
                        onClick={() => onSelectVariant(v)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-[17px] font-bold mt-auto mb-auto text-t1 mb-[2px] tracking-[-0.012em]">
                            {v.label1}<br></br>
                            {v.label2}
                          </div>
                          { /* <div className="text-[12px] text-t2">{v.sub}</div> */ }
                          {v.detail && (
                            <div className="text-[13px] text-t1 font-semibold mt-1 leading-[1.4]">{v.detail}</div>
                          )}
                        </div>
                        <Price p={v.price} />
                      </OptionCard>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Help card */}
        <div className="flex justify-between items-center bg-surface rounded-xl p-[16px_18px] mt-1">
          <div>
            <div className="text-[16px] font-semibold text-t1 mb-1 tracking-[-0.012em]">
              Need help choosing a chip?
            </div>
            <div className="text-[13px] text-t2 leading-[1.4]">
              Compare the options and discover which one is best for you.
            </div>
          </div>
          <span className="text-[22px] text-t2 ml-4 leading-none shrink-0">+</span>
        </div>
      </div>
    </Section>
  );
}