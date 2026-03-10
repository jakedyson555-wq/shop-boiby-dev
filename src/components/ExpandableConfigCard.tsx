import { OptionCard } from "./OptionCard";
import { Price }      from "./Price";
import type { ExtraOption } from "../types";

interface ConfigOption {
  id: string;
  l:  string;
  p:  number;
}

interface ExpandableConfigCardProps {
  title:           string;
  description:     string;
  currentValue?:   string;
  availableText:   React.ReactNode;
  options:         ConfigOption[];
  extraOptions?:   ExtraOption[];
  selected:        ConfigOption | null;
  expanded:        boolean;
  onToggleExpand:  () => void;
  onSelect:        (opt: ConfigOption) => void;
  onSelectExtra?:  (chipId: string, optLabel: string) => void;
}

/**
 * Gray card used for both Unified Memory and SSD Storage.
 * Shows a summary row with an Edit toggle; expanding it reveals the full
 * option list plus an optional "upgrade your chip" upsell panel.
 */
export function ExpandableConfigCard({
  title,
  description,
  currentValue,
  availableText,
  options,
  extraOptions = [],
  selected,
  expanded,
  onToggleExpand,
  onSelect,
  onSelectExtra,
}: ExpandableConfigCardProps) {
  return (
    <div className="config-card">
      <div className="flex items-center gap-[10px] mb-1">
        <span className="text-[18px] font-bold text-t1 tracking-[-0.012em]">{title}</span>
      </div>

      <p className="text-[12px] text-t1 font-semibold mb-3 leading-[1.4]">{description}</p>

      {currentValue && (
        <>
          <p className="text-[12px] text-t2 font-semibold">Current</p>
          <p className="text-[20px] font-bold text-t1 mb-3 tracking-[-0.01em]">{currentValue}</p>
        </>
      )}

      <div className="flex justify-between items-center">
        <p className="text-[12px] text-t2 font-medium m-0 leading-[1.4]">{availableText}</p>
        <button onClick={onToggleExpand} className="edit-btn">Edit</button>
      </div>

      {expanded && (
        <div className="mt-4 animate-var-in">
          <div className="flex flex-col gap-[10px]">
            {options.map(opt => (
              <OptionCard key={opt.id} selected={selected === opt} onClick={() => onSelect(opt)}>
                <span className="text-[16px] font-semibold text-t1 pt-1.5 pb-1.5 tracking-[-0.01em]">{opt.l}</span>
                <Price p={opt.p} />
              </OptionCard>
            ))}
          </div>

          {extraOptions.length > 0 && (
            <div className="mt-3">
              <div className="upgrade-nudge">
                <p className="text-[14px] font-semibold text-t1 mb-[3px] tracking-[-0.012em]">
                  Or choose from more options.
                </p>
                <p className="text-[11px] font-medium text-t1 leading-[1.4]">
                  Available with a change to your chip. You'll be able to review before accepting.
                </p>
              </div>
              <div className="flex flex-col gap-[10px]">
                {extraOptions.map((ex, i) => (
                  <OptionCard
                    key={i}
                    selected={false}
                    onClick={() => onSelectExtra?.(ex.chip, ex.l)}
                  >
                    <span className="text-[16px] font-semibold text-t1 tracking-[-0.015em] pt-1.5 pb-1.5">{ex.l}</span>
                    <span className="text-[12px] font-semibold text-t2 tracking-[-0.01em] ml-4 whitespace-nowrap shrink-0 mt-auto mb-auto">
                      See pricing and changes
                    </span>
                  </OptionCard>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}