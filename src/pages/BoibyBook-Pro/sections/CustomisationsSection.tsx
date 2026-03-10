import { RefObject }            from "react";
import { Section }               from "../../../components/Section";
import { SecTitle }              from "../../../components/SecTitle";
import { ExpandableConfigCard }  from "../../../components/ExpandableConfigCard";
import { MEM, MEM_EXTRA, STOR, STOR_EXTRA } from "../data";
import type { ChipOption, MemOption, StorOption } from "../../../types";

interface CustomisationsSectionProps {
  refProp:      RefObject<HTMLDivElement>;
  chip:         ChipOption | null;
  memory:       MemOption | null;
  storage:      StorOption | null;
  memExpanded:  boolean;
  storExpanded: boolean;
  onSetMemory:  (m: MemOption)  => void;
  onSetStorage: (s: StorOption) => void;
  onToggleMem:  () => void;
  onToggleStor: () => void;
  onOpenModal:  (chipId: string, mem: string | null, stor: string | null) => void;
  locked:       boolean;
  isMobile:     boolean;
}

export function CustomisationsSection({
  refProp, chip, memory, storage,
  memExpanded, storExpanded,
  onSetMemory, onSetStorage, onToggleMem, onToggleStor,
  onOpenModal, locked, isMobile,
}: CustomisationsSectionProps) {
  const memOpts   = chip ? MEM[chip.id]        : [];
  const storOpts  = chip ? STOR[chip.id]       : [];
  const memExtra  = chip ? MEM_EXTRA[chip.id]  : [];
  const storExtra = chip ? STOR_EXTRA[chip.id] : [];

  const memLabels = memOpts.map(m => m.l);
  const memRangeText =
    memLabels.length <= 2
      ? memLabels.join(" or ")
      : memLabels.slice(0, -1).join(", ") + ", or " + memLabels[memLabels.length - 1];

  const storFirst = storOpts[0]?.l ?? "";
  const storLast  = storOpts[storOpts.length - 1]?.l ?? "";

  return (
    <Section refProp={refProp} locked={locked} isMobile={isMobile}>
      <SecTitle bold="Customisations." light="Stay with the base model or make edits." />

      <div className="flex flex-col gap-4">
        <ExpandableConfigCard
          title="Unified Memory"
          description="Add memory to run more apps simultaneously for better multitasking and more demanding tasks."
          currentValue={memory?.l}
          availableText={`Available in ${memRangeText} with your current chip selection`}
          options={memOpts}
          extraOptions={memExtra}
          selected={memory}
          expanded={memExpanded}
          onToggleExpand={onToggleMem}
          onSelect={onSetMemory}
          onSelectExtra={(chipId, mem) => onOpenModal(chipId, mem, null)}
        />

        <ExpandableConfigCard
          title="SSD Storage"
          description="Get ample space and fast access to your apps, photos, movies, music and other files."
          currentValue={storage?.l}
          availableText={`Available in ${storFirst} to ${storLast} with your current chip selection`}
          options={storOpts}
          extraOptions={storExtra}
          selected={storage}
          expanded={storExpanded}
          onToggleExpand={onToggleStor}
          onSelect={onSetStorage}
          onSelectExtra={(chipId, stor) => onOpenModal(chipId, null, stor)}
        />
      </div>
    </Section>
  );
}