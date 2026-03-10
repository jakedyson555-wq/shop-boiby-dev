import { RefObject } from "react";
import { Section }    from "../../../components/Section";
import { SecTitle }   from "../../../components/SecTitle";
import { OptionCard } from "../../../components/OptionCard";
import { Price }      from "../../../components/Price";
import { SIZES }      from "../data";
import type { SizeOption } from "../../../types";

interface SizeSectionProps {
  refProp:  RefObject<HTMLDivElement>;
  selected: SizeOption | null;
  onSelect: (s: SizeOption) => void;
  isMobile: boolean;
}

export function SizeSection({ refProp, selected, onSelect, isMobile }: SizeSectionProps) {
  return (
    <Section refProp={refProp} locked={false} isMobile={isMobile}>
      <SecTitle bold="Model." light="Choose your size." />
      <div className="flex flex-col gap-[10px]">
        {SIZES.map(s => (
          <OptionCard key={s.id} selected={selected === s} onClick={() => onSelect(s)}>
            <div>
              <div className="text-[18px] font-bold text-t1 mb-0.5 tracking-[-0.012em]">
                {s.label}
              </div>
              <div className="text-[13px] text-t1 font-semibold leading-[1.4]">{s.note}</div>
            </div>
            <Price fromTotal={s.fromPrice} />
          </OptionCard>
        ))}
      </div>
    </Section>
  );
}