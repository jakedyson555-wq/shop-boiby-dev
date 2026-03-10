import { RefObject } from "react";
import { Section }   from "../components/Section";
import { SecTitle }  from "../components/SecTitle";
import type { ColorOption } from "../types";

interface ColourSectionProps {
  refProp:   RefObject<HTMLDivElement>;
  /** Pass the product's colour array from its data file. */
  colors:    ColorOption[];
  selected:  ColorOption | null;
  onSelect:  (c: ColorOption) => void;
  /** Section heading — override to customise copy per product. */
  title?:    string;
  subtitle?: string;
  locked:    boolean;
  isMobile:  boolean;
}

export function ColourSection({
  refProp, colors, selected, onSelect,
  title = "Colour.", subtitle = "Pick your favourite.",
  locked, isMobile,
}: ColourSectionProps) {
  return (
    <Section refProp={refProp} locked={locked} isMobile={isMobile}>
      <SecTitle bold={title} light={subtitle} />

      <p className="text-base font-medium text-t1 mb-4 tracking-[-0.005em]">
        {selected ? `Colour — ${selected.name}` : "Select a colour"}
      </p>

      <div className="flex gap-[14px]">
        {colors.map(c => (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            title={c.name}
            className="w-[30px] h-[30px] rounded-full p-0 cursor-pointer transition-[border-color,outline-color] duration-350"
            style={{
              background:    c.hex,
              border:        `2.5px solid ${selected === c ? "#7c3aed" : "transparent"}`,
              outline:       `1.5px solid ${selected === c ? "transparent" : "#d2d2d7"}`,
              outlineOffset: "2px",
            }}
          />
        ))}
      </div>
    </Section>
  );
}