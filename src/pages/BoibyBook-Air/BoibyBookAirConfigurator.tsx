import React, { useState, useRef, useEffect } from "react";

import { useIsMobile } from "../../hooks/useIsMobile";
import { fmt, fmtInt } from "../../utils/formatters";
import type { SpecGroup } from "../../components/SummarySpecCard";
import { CHIPS, CHIP_BY_ID, CHIP_15, COLORS, MEM, STOR } from "./data";

import imgAll      from "../../assets/bba_all.png";
import imgLightBlue from "../../assets/bba_lightblue.png";
import imgSoftPink  from "../../assets/bba_softpink.png";
import imgSilver    from "../../assets/bba_silver.png";
import imgSlate     from "../../assets/bba_slate.png";

import { Modal }        from "../../components/Modal";
import { ScrollHeader } from "../../components/ScrollHeader";
import { Hero }         from "../../components/Hero";
import { NextButton }   from "../../components/NextButton";

import { SizeSection }           from "./sections/SizeSection";
import { ChipSection }           from "./sections/ChipSection";
import { CustomisationsSection } from "./sections/CustomisationsSection";
import { ColourSection }         from "../../sections/ColourSection";
import { Summary }               from "../../sections/Summary";
import { WhatsInTheBox }         from "../../sections/WhatsInTheBox";

import type {
  SizeOption, ColorOption, ChipOption, ChipVariant,
  MemOption, StorOption, ModalData,
} from "../../types";

const STEP_LABELS_13 = ["Colour", "Chip", "Customisations", "Summary"] as const;
const STEP_LABELS_15 = ["Colour", "Customisations", "Summary"]          as const;

export default function BoibybookAirConfigurator() {
  const isMobile = useIsMobile();

  const [size,        setSize]        = useState<SizeOption  | null>(null);
  const [color,       setColor]       = useState<ColorOption | null>(null);
  const [chip,        setChip]        = useState<ChipOption  | null>(null);
  const [chipVariant, setChipVariant] = useState<ChipVariant | null>(null);
  const [memory,      setMemory]      = useState<MemOption   | null>(null);
  const [storage,     setStorage]     = useState<StorOption  | null>(null);

  const [modal,         setModal]         = useState<ModalData | null>(null);
  const [showScrollHdr, setShowScrollHdr] = useState(false);
  const [activeStep,    setActiveStep]    = useState(0);
  const [memExpanded,   setMemExpanded]   = useState(false);
  const [storExpanded,  setStorExpanded]  = useState(false);

  const rModel  = useRef<HTMLDivElement>(null);
  const rColour = useRef<HTMLDivElement>(null);
  const rChip   = useRef<HTMLDivElement>(null);
  const rMemory = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const STEP_REFS = [rModel, rColour, rChip, rMemory];

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setShowScrollHdr(!entry.isIntersecting),
      { threshold: 0 },
    );
    if (heroRef.current) obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  const is15 = size?.id === "15";

  const applyChip = (c: ChipOption, cv: ChipVariant | null) => {
    setChip(c);
    setChipVariant(cv ?? c.variants[0]);
    setMemory(null);
    setStorage(null);
    setMemExpanded(false);
    setStorExpanded(false);
  };

  const stepDone = (step: number): boolean => {
    if (step === 0) return size   !== null;
    if (step === 1) return color  !== null;
    if (step === 2) return chip   !== null;
    if (step === 3) return memory !== null && storage !== null;
    return false;
  };

  const allDone     = [0, 1, 2, 3].every(stepDone);
  const showNextBtn = activeStep < 3 && stepDone(activeStep);

  const nextLabel = is15
    ? `Next: ${(STEP_LABELS_15 as readonly string[])[activeStep] ?? ""}`
    : `Next: ${STEP_LABELS_13[activeStep] ?? ""}`;

  const goNext = () => {
    if (!stepDone(activeStep)) return;
    let next = activeStep + 1;
    if (next === 2 && is15) next = 3;
    if (next === 3 && chip) {
      if (!memory)  setMemory(MEM[chip.id][0]);
      if (!storage) setStorage(STOR[chip.id][0]);
    }
    setActiveStep(next);
    setTimeout(
      () => STEP_REFS[next]?.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      80,
    );
  };

  const handleSize = (s: SizeOption) => {
    setSize(s);
    setColor(null);
    setMemory(null);
    setStorage(null);
    setMemExpanded(false);
    setStorExpanded(false);
    setActiveStep(0);
    if (s.id === "15") {
      applyChip(CHIP_15, null);
    } else {
      setChip(null);
      setChipVariant(null);
    }
  };

  const handleColor = (c: ColorOption) => {
    setColor(c);
    if (activeStep > 1) {
      setMemory(null);
      setStorage(null);
      if (!is15) { setChip(null); setChipVariant(null); }
      setActiveStep(1);
    }
  };

  const handleChip = (c: ChipOption) => {
    applyChip(c, null);
    if (activeStep > 2) setActiveStep(2);
  };

  const openModal = (
    targetChipId: string,
    targetMem:  string | null,
    targetStor: string | null,
  ) => {
    const nc    = CHIP_BY_ID[targetChipId];
    const ncv   = nc.variants[0];
    const mOpts = MEM[targetChipId];
    const sOpts = STOR[targetChipId];

    const nm: MemOption = targetMem
      ? (mOpts.find(m => m.l === targetMem) ?? mOpts[0])
      : (mOpts.find(m => m.l === memory?.l) ?? mOpts[0]);

    const ns: StorOption = (() => {
      if (targetStor) return sOpts.find(s => s.l === targetStor) ?? sOpts[0];
      if (storage)    return sOpts.find(s => s.l === storage.l)  ?? sOpts[0];
      return sOpts[0];
    })();

    const changes: ModalData["changes"] = [];
    if (nc.id !== chip?.id) {
      changes.push({
        label: "Chip",
        from:  chip?.spec ?? chip?.name ?? "-",
        to:    nc.spec    ?? nc.name,
      });
    }
    const storageForced = storage && !STOR[targetChipId].some(s => s.l === storage.l);
    if (targetStor || storageForced) {
      changes.push({
        label: "Storage",
        from:  storage ? `${storage.l} SSD` : "-",
        to:    `${ns.l} SSD`,
      });
    }

    const oldTotal = (size?.basePrice ?? 0) + (chip?.basePrice ?? 0) + (memory?.p ?? 0) + (storage?.p ?? 0);
    const newTotal = (size?.basePrice ?? 0) + nc.basePrice + nm.p + ns.p;

    setModal({
      targetLabel: targetMem ?? targetStor ?? "",
      nc, ncv, nm, ns, changes,
      oldTotal, newTotal,
      diff: newTotal - oldTotal,
    });
  };

  const acceptModal = () => {
    if (!modal) return;
    const wasMem  = memExpanded;
    const wasStor = storExpanded;
    applyChip(modal.nc, modal.ncv);
    setMemory(modal.nm);
    setStorage(modal.ns);
    setMemExpanded(wasMem);
    setStorExpanded(wasStor);
    setModal(null);
  };

  const cv = chipVariant ?? chip?.variants[0] ?? null;

  const total = (size?.basePrice ?? 0)
              + (chip?.basePrice ?? 0)
              + (memory?.p ?? 0)
              + (storage?.p ?? 0);

  const gst = Math.round((total / 11) * 100) / 100;

  const priceDisplay = !size        ? `From ${fmtInt(1699)}`
                     : !stepDone(2) ? `From ${fmtInt(size.fromPrice)}`
                     : fmt(total);

  const airAdapterLabel = is15 ? "70W USB-C Power Adapter" : "50W USB-C Power Adapter";

  const summarySpecGroups: SpecGroup[] = allDone && chip && cv ? [
    {
      items: [
        {
          label: chip.name,
          sub:   `${cv.label1.replace(",", "")} ${cv.label2}, ${cv.sub}`,
        },
      ],
    },
    {
      items: [
        { label: `${memory!.l} unified memory` },
        { label: `${storage!.l} SSD storage`   },
        { label: airAdapterLabel               },
      ],
    },
    {
      small: true,
      items: [
        { label: "BoibySafe 3, Two Thunderbolt 4 ports, 3.5mm headphone jack, microSD card slot" },
        { label: "Support for up to two external displays" },
      ],
    },
  ] : [];

  const boxItems = size && chip ? [
    { key: "laptop",  label: `${size.label} BoibyBook Air` },
    { key: "cable",   label: "USB-C to USB-C Cable (1 m)"  },
    { key: "adapter", label: airAdapterLabel               },
  ] : [];

  const heroImage =
    color?.id === "lightblue" ? imgLightBlue
  : color?.id === "softpink"  ? imgSoftPink
  : color?.id === "silver"    ? imgSilver
  : color?.id === "slate"     ? imgSlate
  : imgAll;

  return (
    <div className="min-h-screen bg-white font-sans text-t1 antialiased">

      {modal && (
        <Modal data={modal} onClose={() => setModal(null)} onAccept={acceptModal} />
      )}

      {showScrollHdr && (
        <ScrollHeader
          title="BoibyBook Air"
          priceDisplay={priceDisplay}
          isMobile={isMobile}
        />
      )}

      <div ref={heroRef}>
        <Hero
          badge="New"
          title="BoibyBook Air"
          subtitles={["Buy BoibyBook Air"]}
          priceDisplay={priceDisplay}
          pills={[
            { label: "Add a trade-in to save on your new BoibyBook  >" },
            { label: "Pay monthly at 0% interest with financing  >"    },
          ]}
          isMobile={isMobile}
        />
      </div>

      <div className={`flex w-full items-start ${isMobile ? "" : "px-[4%]"}`}>

        {!isMobile && (
          <div
            className="flex-1 sticky flex items-center justify-center overflow-hidden transition-[top,height] duration-300"
            style={{
              top:      showScrollHdr ? 52 : 0,
              height:   `calc(100vh - ${showScrollHdr ? 52 : 0}px)`,
              minWidth: `calc(96% - 330px)`,
              width:    `calc(96% - 330px)`,
            }}
          >
            <div
              className="flex-1 max-h-[85vh] bg-surface flex items-center justify-center overflow-hidden rounded-[20px]"
              style={{ aspectRatio: "16/10" }}
            >
              <img
                key={heroImage}
                src={heroImage}
                alt={color ? `BoibyBook Air in ${color.name}` : "BoibyBook Air"}
                className="w-[70%] max-h-[70%] object-contain animate-img-fade"
              />
            </div>
          </div>
        )}

        <div
          className={`${isMobile ? "flex-col w-full px-[8%]" : "flex-col pl-[4%]"} min-w-0`}
          style={{ minWidth: "330px" }}
        >
          <SizeSection
            refProp={rModel}
            selected={size}
            onSelect={handleSize}
            isMobile={isMobile}
          />

          <ColourSection
            refProp={rColour}
            colors={COLORS}
            selected={color}
            onSelect={handleColor}
            subtitle="Pick your favorite."
            locked={activeStep < 1}
            isMobile={isMobile}
          />

          {!is15 && (
            <ChipSection
              refProp={rChip}
              availChips={CHIPS}
              selected={chip}
              size={size}
              onSelectChip={handleChip}
              locked={activeStep < 2}
              isMobile={isMobile}
            />
          )}

          <CustomisationsSection
            refProp={rMemory}
            chip={chip}
            memory={memory}
            storage={storage}
            memExpanded={memExpanded}
            storExpanded={storExpanded}
            onSetMemory={setMemory}
            onSetStorage={setStorage}
            onToggleMem={() => setMemExpanded(e => !e)}
            onToggleStor={() => setStorExpanded(e => !e)}
            onOpenModal={openModal}
            locked={activeStep < 3}
            isMobile={isMobile}
          />

          <Summary
            allDone={allDone}
            teaserHeadline="Your new BoibyBook Air awaits."
            teaserSubline="Make it yours."
            headline="Your new BoibyBook Air."
            subline="Everything look good?"
            productName={size ? `${size.label} BoibyBook Air` : ""}
            colorName={color?.name ?? ""}
            specGroups={summarySpecGroups}
            total={total}
            gst={gst}
            deliveryText="Pick up tomorrow at a Boiby store near you or get it delivered"
            isMobile={isMobile}
          />
        </div>
      </div>

      {size && chip && <WhatsInTheBox items={boxItems} />}

      {showNextBtn && (
        <NextButton
          label={nextLabel}
          onClick={goNext}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}