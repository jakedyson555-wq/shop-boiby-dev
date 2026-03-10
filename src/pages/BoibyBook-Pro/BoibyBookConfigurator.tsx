import React, { useState, useRef, useEffect } from "react";

import { useIsMobile }  from "../../hooks/useIsMobile";
import { fmt, fmtInt, getAdapterLabel }  from "../../utils/formatters";
import type { SpecGroup } from "../../components/SummarySpecCard";
import { CHIPS, CHIP_BY_ID, COLORS, MEM, STOR } from "./data";

import imgSilver from "../../assets/bbp-silver.png";
import imgBlack  from "../../assets/bbp-black.png";
import imgAll    from "../../assets/bbp-all.png";

import { Modal }        from "../../components/Modal";
import { ScrollHeader } from "../../components/ScrollHeader";
import { Hero }         from "../../components/Hero";
import { NextButton }   from "../../components/NextButton";

// ── Product-specific sections (live alongside this file) ────────────────────
import { SizeSection }           from "./sections/SizeSection";
import { ChipSection }           from "./sections/ChipSection";
import { CustomisationsSection } from "./sections/CustomisationsSection";

// ── Generic reusable sections ────────────────────────────────────────────────
import { ColourSection }  from "../../sections/ColourSection";
import { Summary }        from "../../sections/Summary";
import { WhatsInTheBox }  from "../../sections/WhatsInTheBox";

import type {
  SizeOption, ColorOption, ChipOption, ChipVariant,
  MemOption, StorOption, ModalData,
} from "../../types";

const STEP_LABELS = ["Colour", "Chip", "Customisations", "Summary"];

export default function BoibyBookConfigurator() {
  const isMobile = useIsMobile();

  // ── Config state ────────────────────────────────────────────────────────────
  const [size,        setSize]        = useState<SizeOption  | null>(null);
  const [color,       setColor]       = useState<ColorOption | null>(null);
  const [chip,        setChip]        = useState<ChipOption  | null>(null);
  const [chipVariant, setChipVariant] = useState<ChipVariant | null>(null);
  const [memory,      setMemory]      = useState<MemOption   | null>(null);
  const [storage,     setStorage]     = useState<StorOption  | null>(null);

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [modal,         setModal]         = useState<ModalData | null>(null);
  const [showScrollHdr, setShowScrollHdr] = useState(false);
  const [activeStep,    setActiveStep]    = useState(0);
  const [memExpanded,   setMemExpanded]   = useState(false);
  const [storExpanded,  setStorExpanded]  = useState(false);

  // ── Section refs (for smooth-scroll on Next) ─────────────────────────────────
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

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const applyChip = (c: ChipOption, cv: ChipVariant | null) => {
    setChip(c);
    setChipVariant(cv ?? (c.isAuto ? c.variants[0] : null));
    setMemory(null);
    setStorage(null);
    setMemExpanded(false);
    setStorExpanded(false);
  };

  const stepDone = (step: number): boolean => {
    if (step === 0) return size  !== null;
    if (step === 1) return color !== null;
    if (step === 2) return chip  !== null && (chip.isAuto || chipVariant !== null);
    if (step === 3) return memory !== null && storage !== null;
    return false;
  };

  const allDone     = [0, 1, 2, 3].every(stepDone);
  const showNextBtn = activeStep < 3 && stepDone(activeStep);

  const goNext = () => {
    if (!stepDone(activeStep)) return;
    const next = activeStep + 1;
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

  // ── Event handlers ────────────────────────────────────────────────────────────
  const handleSize = (s: SizeOption) => {
    setSize(s);
    if (s.id === "16" && chip?.id === "b6") {
      setChip(null); setChipVariant(null); setMemory(null); setStorage(null);
    }
    if (activeStep > 0) {
      setColor(null); setChip(null); setChipVariant(null);
      setMemory(null); setStorage(null); setActiveStep(0);
    }
  };

  const handleColor = (c: ColorOption) => {
    setColor(c);
    if (activeStep > 1) {
      setChip(null); setChipVariant(null); setMemory(null); setStorage(null);
      setActiveStep(1);
    }
  };

  const handleChip = (c: ChipOption) => {
    applyChip(c, null);
    if (activeStep > 2) { setMemory(null); setStorage(null); setActiveStep(2); }
  };

  const handleVariant = (v: ChipVariant) => {
    setChipVariant(v);
    if (activeStep > 2) { setMemory(null); setStorage(null); setActiveStep(2); }
  };

  // ── Modal logic ───────────────────────────────────────────────────────────────
  const openModal = (targetChipId: string, targetMem: string | null, targetStor: string | null) => {
    const nc    = CHIP_BY_ID[targetChipId];
    const ncv   = nc.variants[0];
    const mOpts = MEM[targetChipId];
    const sOpts = STOR[targetChipId];

    const nm: MemOption = targetMem
      ? (mOpts.find(m => m.l === targetMem) ?? mOpts[0])
      : mOpts[0];

    const ns: StorOption = (() => {
      if (targetStor)  return sOpts.find(s => s.l === targetStor) ?? sOpts[0];
      if (storage)     return sOpts.find(s => s.l === storage.l)  ?? sOpts[0];
      return sOpts[0];
    })();

    const changes: ModalData["changes"] = [];
    if (nc.id !== chip?.id) {
      changes.push({ label: "Chip", from: chip?.name ?? "—", to: nc.name });
    }
    const storageForced = storage && !STOR[targetChipId].some(s => s.l === storage.l);
    if (targetStor || storageForced) {
      changes.push({
        label: "Storage",
        from:  storage ? `${storage.l} SSD` : "—",
        to:    `${ns.l} SSD`,
      });
    }

    const oldTotal = (size?.basePrice ?? 0) + (chip?.basePrice ?? 0) + (chipVariant?.price ?? 0) + (memory?.p ?? 0) + (storage?.p ?? 0);
    const newTotal = (size?.basePrice ?? 0) + nc.basePrice + ncv.price + nm.p + ns.p;

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

  // ── Derived values ────────────────────────────────────────────────────────────
  const availChips   = size?.id === "16" ? CHIPS.filter(c => c.id !== "b6") : CHIPS;
  const total        = (size?.basePrice ?? 0) + (chip?.basePrice ?? 0) + (chipVariant?.price ?? 0) + (memory?.p ?? 0) + (storage?.p ?? 0);
  const gst          = Math.round((total / 11) * 100) / 100;
  const priceDisplay = !size        ? `From ${fmtInt(2599)}`
                     : !chip        ? `From ${fmtInt(size.fromPrice)}`
                     : fmt(total);
  // Build specGroups here so Summary section stays fully generic
  const summarySpecGroups: SpecGroup[] = allDone && chip ? [
    {
      items: [
        {
          label: chip.name,
          sub:   `${(chipVariant?.label1 ?? chip.variants[0].label1).replace(",", "")}, ${(chipVariant?.label2 ?? chip.variants[0].label2)}, ${chipVariant?.sub ?? chip.variants[0].sub}`,
        },
      ],
    },
    {
      items: [
        { label: `${memory!.l} unified memory` },
        { label: `${storage!.l} SSD storage` },
        { label: getAdapterLabel(size!, chip) },
      ],
    },
    {
      small: true,
      items: [
        { label: "Three Thunderbolt 5 ports, USB 3 Type-A port, BoibySafe 3 port, 3.5mm headphone jack, HDMI port, SD Express card slot" },
        { label: chip.id === "b6" ? "Support for up to two external displays" : "Support for up to three external displays" },
      ],
    },
  ] : [];

  // Build box items here so WhatsInTheBox stays fully generic
  const boxItems = size && chip ? [
    { key: "laptop",  label: `${size.label} BoibyBook Pro` },
    { key: "cable",   label: "USB-C to BoibySafe 3 Cable (2 m)" },
    { key: "adapter", label: getAdapterLabel(size, chip) },
  ] : [];

  const heroImage =
    color?.id === "silver" ? imgSilver
    : color?.id === "black" ? imgBlack
    : imgAll;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white font-sans text-t1 antialiased">

      {modal && (
        <Modal data={modal} onClose={() => setModal(null)} onAccept={acceptModal} />
      )}

      {showScrollHdr && (
        <ScrollHeader
          title="BoibyBook Pro"
          priceDisplay={priceDisplay}
          isMobile={isMobile}
        />
      )}

      <div ref={heroRef}>
        <Hero
          badge="New"
          title="BoibyBook Pro"
          subtitles={["Buy BoibyBook Pro"]}
          priceDisplay={priceDisplay}
          pills={[
            { label: "Add a trade-in to save on your new BoibyBook  ›" },
            { label: "Pay monthly at 0% interest with financing  ›" },
          ]}
          isMobile={isMobile}
        />
      </div>

      <div className={`flex w-full items-start ${isMobile ? "" : "px-[4%]"}`}>

        {/* LEFT — sticky product visual (desktop only) */}
        {!isMobile && (
          <div
            className="flex-1 sticky flex items-center justify-center overflow-hidden transition-[top,height] duration-300"
            style={{
              
              top:    showScrollHdr ? 52 : 0,
              height: `calc(100vh - ${showScrollHdr ? 52 : 0}px)`,
              minWidth: `calc(96% - 330px)`,
              width: `calc(96% - 330px)`,
            }}
          >
            <div className="flex-1 max-h-[85vh] bg-surface flex items-center justify-center overflow-hidden rounded-[20px]" style={{ aspectRatio: 16/10 }}>
              <img
                key={heroImage}
                src={heroImage}
                alt={color ? `BoibyBook Pro in ${color.name}` : "BoibyBook Pro"}
                className="w-[70%] max-h-[70%] object-contain animate-img-fade"
              />
            </div>
          </div>
        )}

        {/* RIGHT — configuration sections */}
        <div className={`${isMobile ? "flex-col w-full px-[8%]" : "flex-col pl-[4%]"} min-w-0`} style={{minWidth: `330px`}}>
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
            locked={activeStep < 1}
            isMobile={isMobile}
          />
          <ChipSection
            refProp={rChip}
            availChips={availChips}
            selected={chip}
            chipVariant={chipVariant}
            size={size}
            onSelectChip={handleChip}
            onSelectVariant={handleVariant}
            locked={activeStep < 2}
            isMobile={isMobile}
          />
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
            teaserHeadline="Your new BoibyBook Pro awaits."
            teaserSubline="Make it yours."
            headline="Your new BoibyBook Pro."
            subline="Everything look good?"
            productName={size ? `${size.label} BoibyBook Pro` : ""}
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
          label={`Next: ${STEP_LABELS[activeStep]}`}
          onClick={goNext}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}