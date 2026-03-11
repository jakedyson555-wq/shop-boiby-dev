import { RefObject } from "react";
import { Section } from "../../../components/Section";
import { SecTitle } from "../../../components/SecTitle";
import { OptionCard } from "../../../components/OptionCard";
import { Price } from "../../../components/Price";
import type { SizeOption, ChipOption } from "../../../types";

interface ChipSectionProps {
  refProp:      RefObject<HTMLDivElement>;
  availChips:   ChipOption[];
  selected:     ChipOption | null;
  size:         SizeOption | null;
  onSelectChip: (c: ChipOption) => void;
  locked:       boolean;
  isMobile:     boolean;
}

export function ChipSection({
  refProp, availChips, selected, size,
  onSelectChip, locked, isMobile,
}: ChipSectionProps) {
  return (
    <Section refProp={refProp} locked={locked} isMobile={isMobile}>
      <SecTitle bold="Chip." light="Choose your processing power." />

      <div className="flex flex-col gap-[10px]">
        {availChips.map(c => (
          <OptionCard
            key={c.id}
            selected={selected === c}
            onClick={() => onSelectChip(c)}
          >
            <div className="flex-1 min-w-0">
              {c.badge && (
                <div className="text-[15px] font-semibold text-accent-orange tracking-[0.005em]">
                  {c.badge}
                </div>
              )}
              <div className="text-[18px] font-bold text-t1 tracking-[-0.01em]">
                {c.name}
              </div>
              {c.spec && (
                <div className="text-[18px] font-bold text-t1 leading-[1.3] tracking-[-0.01em]">
                  {c.spec.split(", ")[0]},<br />{c.spec.split(", ")[1]}
                </div>
              )}
              <div className={`text-[13px] mt-1 text-t1 font-semibold leading-[1.4] ${c.spec ? "mb-[2px]" : ""}`}>
                {c.desc}
              </div>
            </div>
            <Price fromTotal={(size?.basePrice ?? 0) + c.basePrice} />
          </OptionCard>
        ))}

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