import React, { useState, useRef, useEffect } from "react";

// TODO: finish/see summary button

@theme {
  --color-brand:   #7c3aed;
  --color-p-ring:  rgba(124, 58, 237, 0.18);
  --color-border:  #d2d2d7;
  --color-surface: #f5f5f7;
  --color-t1:      #1d1d1f;
  --color-t2:      #6e6e73;
  --color-orange:  #bf4800;
  --color-teal:    #0071e3;
}

const fmt    = (n) => `A$${n.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtInt = (n) => `A$${n.toLocaleString("en-AU", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const getAdapterLabel = (size, chip) => {
  if (size.id === "14" && chip.id === "b6")                                    return "75W USB-C Power Adapter";
  if (size.id === "16" && (chip.id === "b6pro" || chip.id === "b6max"))        return "140W USB-C Power Adapter";
  return "100W USB-C Power Adapter";
};

// ── Data ─────────────────────────────────────────────────────────────────────
const SIZES = [
  { id: "14", label: "14-inch", note: "B6, B6 Pro or B6 Max chip.", basePrice: 2499, fromPrice: 2499 },
  { id: "16", label: "16-inch", note: "B6 Pro or B6 Max chip.",     basePrice: 3199, fromPrice: 3899 },
];

const COLORS = [
  { id: "black",  name: "Space Black", hex: "#3a3a3c", bg: "#3a3a3c" },
  { id: "silver", name: "Silver",      hex: "#c8c8ca", bg: "#c8c8ca" },
];

const CHIPS = [
  {
    id: "b6", name: "Boiby B6 chip", badge: "New",
    desc: "Exceptional performance for everyday professional and creative tasks.",
    spec: "12-core CPU, 12-core GPU, 18-core NPU", basePrice: 0, isAuto: true,
    variants: [{ id: "b6v0", label: "12-core CPU and 12-core GPU", sub: "18-core NPU", price: 0 }],
  },
  {
    id: "b6pro", name: "Boiby B6 Pro chip", badge: "New",
    desc: "More performance and higher memory options for demanding workflows.",
    spec: "2 options available with 18-core NPU",
    basePrice: 700, isAuto: false,
    variants: [
      { id: "bp0", label: "16-core CPU and 19-core GPU", sub: "18-core NPU", price: 0,   detail: null },
      { id: "bp1", label: "18-core CPU and 24-core GPU", sub: "18-core NPU", price: 400, detail: "Boost your processing and graphics performance." },
    ],
  },
  {
    id: "b6max", name: "Boiby B6 Max chip", badge: "New",
    desc: "Our most advanced chip ever. Made to power the most extreme workflows.",
    spec: "2 options available with 18-core NPU",
    basePrice: 2800, isAuto: false,
    variants: [
      { id: "bm0", label: "18-core CPU and 38-core GPU", sub: "18-core NPU", price: 0,   detail: null },
      { id: "bm1", label: "20-core CPU and 48-core GPU", sub: "18-core NPU", price: 400, detail: "Boost your processing and graphics performance." },
    ],
  },
];

const CHIP_BY_ID = Object.fromEntries(CHIPS.map(c => [c.id, c]));

const MEM = {
  b6:    [{ id: "m16",  l: "16GB",  p: 0    }, { id: "m24",  l: "24GB",  p: 200  }, { id: "m32a", l: "32GB",  p: 400  }],
  b6pro: [{ id: "m24b", l: "24GB",  p: 0    }, { id: "m48",  l: "48GB",  p: 400  }, { id: "m64",  l: "64GB",  p: 600  }],
  b6max: [{ id: "m48x", l: "48GB",  p: 0    }, { id: "m64x", l: "64GB",  p: 200  }, { id: "m128", l: "128GB", p: 1000 }],
};
const MEM_EXTRA = {
  b6:    [{ l: "48GB", chip: "b6pro" }, { l: "64GB", chip: "b6pro" }, { l: "128GB", chip: "b6max" }],
  b6pro: [{ l: "128GB", chip: "b6max" }],
  b6max: [],
};

const STOR = {
  b6:    [{ id: "s1a", l: "1TB", p: 0 }, { id: "s2a", l: "2TB", p: 200 }, { id: "s4a", l: "4TB", p: 600  }],
  b6pro: [{ id: "s1b", l: "1TB", p: 0 }, { id: "s2b", l: "2TB", p: 200 }, { id: "s4b", l: "4TB", p: 600  }],
  b6max: [{ id: "s2c", l: "2TB", p: 0 }, { id: "s4c", l: "4TB", p: 400 }, { id: "s8",  l: "8TB", p: 1200 }],
};
const STOR_EXTRA = {
  b6:    [{ l: "8TB", chip: "b6max" }],
  b6pro: [{ l: "8TB", chip: "b6max" }],
  b6max: [],
};

// ── Global CSS ────────────────────────────────────────────────────────────────
const GS = `
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  button, a { font-family: inherit; text-decoration: none; }
  @keyframes varIn     { from { opacity:0; transform:translateY(-6px) } to { opacity:1; transform:translateY(0) } }
  @keyframes overlayIn { from { opacity:0 } to { opacity:1 } }
  @keyframes modalIn   { from { opacity:0 } to { opacity:1 } }
  @keyframes hdrSlide  { from { opacity:0; transform:translateY(-100%) } to { opacity:1; transform:translateY(0) } }
  @keyframes nextBtnIn { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
  @keyframes imgFade   { from { opacity:0 } to { opacity:1 } }
`;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return isMobile;
}

// ── Atoms ─────────────────────────────────────────────────────────────────────
function SecTitle({ bold, light }) {
  return (
    <h2 style={{ fontSize: 24, fontWeight: 600, color: T1, margin: "0 0 24px", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
      {bold} <span style={{ color: T2, fontWeight: 400 }}>{light}</span>
    </h2>
  );
}

function Price({ p, fromTotal }: { p?: number; fromTotal?: number }) {
  const base = { fontSize: 14, whiteSpace: "nowrap" as const, marginLeft: 16, flexShrink: 0 };
  if (fromTotal !== undefined)
    return <span style={{ ...base, color: T2 }}>From {fmtInt(fromTotal)}</span>;
  return (
    <span style={{ ...base, color: (p ?? 0) > 0 ? T1 : T2, fontWeight: (p ?? 0) > 0 ? 500 : 400 }}>
      {(p ?? 0) === 0 ? "Included" : `+ ${fmt(p!)}`}
    </span>
  );
}

function OptionCard({
  selected, onClick, children, disabled
}: {
  selected: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => { if (!disabled) setHov(true); }}
      onMouseLeave={() => { if (!disabled) setHov(false); }}
      style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      width: "100%", padding: "18px 18px", textAlign: "left",
      background: "#fff",
      border: `1.5px solid ${selected ? P : hov ? "#b0b0b5" : BORDER}`,
      borderRadius: 15,
      cursor: disabled ? "default" : "pointer",
      transition: "border-color 0.3s ease",
      opacity: disabled ? 0.45 : 1,
      textDecoration: "none", }}
    >
      {children}
    </button>
  );
}

// Section: full-viewport-height, content centred vertically
function Section({ refProp, children, locked, isMobile }) {
  return (
    <div
      ref={refProp}
      style={{
        minHeight: isMobile ? `calc(70vh - ${NAV_H}px)` : `calc(100vh - ${NAV_H}px)`,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: isMobile ? "48px 20px" : "3% 2%",
        scrollMarginTop: NAV_H + 4,
        opacity: locked ? 0.38 : 1,
        pointerEvents: locked ? "none" : "auto",
        transition: "opacity 0.4s ease",
        borderBottom: isMobile ? `1px solid ${BORDER}` : "none",
      }}
    >
      {children}
    </div>
  );
}

// ── What's in the Box ─────────────────────────────────────────────────────────
function WhatsInTheBox({ size, chip }) {
  const adapterLabel = getAdapterLabel(size, chip);
  const laptopLabel  = `${size.label} BoibyBook Pro`;
  const cableLabel   = "USB-C to BoibySafe 3 Cable (2 m)";

  const items = [
    { key: "laptop",  label: laptopLabel  },
    { key: "cable",   label: cableLabel   },
    { key: "adapter", label: adapterLabel },
  ];

  return (
    <div style={{ padding: "80px 0 100px", background: "#fff", borderTop: `1px solid ${BORDER}` }}>
      <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 700, color: T1, margin: "0 0 48px", letterSpacing: "-0.01em" }}>
        What's in the Box
      </h2>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 60px" }}>
        <div style={{ background: GRAY, borderRadius: 24, height: 280 }} />
        <div style={{ display: "flex", marginTop: 20 }}>
          {items.map((item) => (
            <div key={item.key} style={{ flex: 1, textAlign: "center" }}>
              <p style={{ fontSize: 13, color: T2, margin: 0, lineHeight: 1.5, padding: "0 16px" }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Summary ───────────────────────────────────────────────────────────────────
function Summary({ size, color, chip, chipVariant, memory, storage, total, gst, allDone, isMobile }) {
  const [done, setDone] = useState(false);
  const pad = isMobile ? "48px 20px 80px" : "64px 48px 80px";

  if (!allDone) {
    return (
      <div style={{ padding: pad }}>
        <p style={{ fontSize: 26, fontWeight: 600, color: T1, margin: "0 0 12px", letterSpacing: "-0.01em", lineHeight: 1.25 }}>
          Your new BoibyBook Pro awaits.
        </p>
        <p style={{ fontSize: 26, fontWeight: 600, color: T2, margin: 0, letterSpacing: "-0.01em", lineHeight: 1.45 }}>
          Customise it and make it yours.
        </p>
      </div>
    );
  }

  const adapter  = getAdapterLabel(size, chip);
  const displays = chip.id === "b6" ? "Support for up to two external displays" : "Support for up to three external displays";
  const ports    = "Three Thunderbolt 5 ports, USB 3 Type-A port, BoibySafe 3 port, 3.5mm headphone jack, HDMI port, SD Express card slot";
  const varLabel = (chipVariant?.label ?? chip.variants[0].label).replace(" and ", ", ");
  const npuLabel = chipVariant?.sub ?? chip.variants[0].sub;
  const fullSpecLabel = `${varLabel}, ${npuLabel}`;

  return (
    <div style={{ padding: pad }}>
      <p style={{ fontSize: 26, fontWeight: 600, color: T1, margin: "0 0 4px", letterSpacing: "-0.01em", lineHeight: 1.25 }}>
        Your new BoibyBook Pro.
      </p>
      <p style={{ fontSize: 26, fontWeight: 600, color: T2, margin: "0 0 32px", letterSpacing: "-0.01em", lineHeight: 1.25 }}>
        Everything look good?
      </p>

      <div style={{ background: GRAY, borderRadius: 18, padding: "22px 22px 18px", marginBottom: 32 }}>
        <p style={{ fontSize: 22, fontWeight: 700, color: T1, margin: "0 0 2px", letterSpacing: "-0.01em" }}>
          {size.label} BoibyBook Pro
        </p>
        <p style={{ fontSize: 17, color: T2, margin: "0 0 18px" }}>{color.name}</p>

        <div style={{ height: 1, background: BORDER, marginBottom: 18 }} />

        <p style={{ fontSize: 16, fontWeight: 700, color: T1, margin: "0 0 4px", letterSpacing: "-0.01em" }}>{chip.name}</p>
        <p style={{ fontSize: 13, color: T2, margin: "0 0 14px" }}>{fullSpecLabel}</p>
        <p style={{ fontSize: 16, fontWeight: 700, color: T1, margin: "0 0 10px", letterSpacing: "-0.01em" }}>{memory.l} unified memory</p>
        <p style={{ fontSize: 16, fontWeight: 700, color: T1, margin: "0 0 10px", letterSpacing: "-0.01em" }}>{storage.l} SSD storage</p>
        <p style={{ fontSize: 16, fontWeight: 700, color: T1, margin: "0 0 22px", letterSpacing: "-0.01em" }}>{adapter}</p>

        <div style={{ height: 1, background: BORDER, marginBottom: 18 }} />

        <p style={{ fontSize: 13, color: T2, margin: "0 0 8px", lineHeight: 1.6 }}>{ports}</p>
        <p style={{ fontSize: 13, color: T2, margin: 0, lineHeight: 1.6 }}>{displays}</p>
      </div>

      <p style={{ fontSize: 36, fontWeight: 700, color: T1, margin: "0 0 5px", letterSpacing: "-0.025em" }}>{fmt(total)}</p>
      <p style={{ fontSize: 14, color: "#3a3a3c", margin: "0 0 5px" }}>Includes GST of approx. {fmt(gst)}</p>
      <p style={{ fontSize: 14, color: T2, margin: "0 0 26px", lineHeight: 1.5 }}>
        Pick up tomorrow at a Boiby store near you or get it delivered
      </p>

      <button
        onClick={() => { setDone(true); setTimeout(() => setDone(false), 2400); }}
        style={{
          width: "100%", padding: "10px 0", borderRadius: 980,
          background: done ? "#34a853" : P, color: "#fff", border: "none",
          fontSize: 16, fontWeight: 600, cursor: "pointer", letterSpacing: "-0.01em",
          transition: "background 0.55s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {done ? "Added to Bag" : "Continue"}
      </button>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function BoibyBookConfigurator() {
  const isMobile = useIsMobile();
  const [size,        setSize]        = useState(null);
  const [color,       setColor]       = useState(null);
  const [chip,        setChip]        = useState(null);
  const [chipVariant, setChipVariant] = useState(null);
  const [memory,      setMemory]      = useState(null);
  const [storage,     setStorage]     = useState(null);
  const [modal,         setModal]         = useState(null);
  const [showScrollHdr, setShowScrollHdr] = useState(false);
  const [activeStep,    setActiveStep]    = useState(0);
  const [memExpanded,   setMemExpanded]   = useState(false);
  const [storExpanded,  setStorExpanded]  = useState(false);

  const rModel  = useRef(null);
  const rColour = useRef(null);
  const rChip   = useRef(null);
  const rMemory = useRef(null);
  const heroRef = useRef(null);

  const STEP_REFS   = [rModel, rColour, rChip, rMemory];
  const STEP_LABELS = ["Colour", "Chip", "Customisations", "Summary"];

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setShowScrollHdr(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (heroRef.current) obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  const applyChip = (c, cv) => {
    setChip(c); setChipVariant(cv ?? (c.isAuto ? c.variants[0] : null));
    setMemory(null); setStorage(null);
    setMemExpanded(false); setStorExpanded(false);
  };

  const stepDone = (step) => {
    if (step === 0) return size !== null;
    if (step === 1) return color !== null;
    if (step === 2) return chip !== null && (chip.isAuto || chipVariant !== null);
    if (step === 3) return memory !== null && storage !== null;
    return false;
  };

  const allDone     = stepDone(0) && stepDone(1) && stepDone(2) && stepDone(3);
  const nextEnabled = stepDone(activeStep) && activeStep < 3;
  const showNextBtn = activeStep < 3 && stepDone(activeStep);

  const goNext = () => {
    if (!nextEnabled) return;
    const next = activeStep + 1;
    if (next === 3 && chip) {
      if (!memory)  setMemory(MEM[chip.id][0]);
      if (!storage) setStorage(STOR[chip.id][0]);
    }
    setActiveStep(next);
    setTimeout(() => STEP_REFS[next]?.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const handleSize    = (s) => {
    setSize(s);
    if (s.id === "16" && chip?.id === "b6") { setChip(null); setChipVariant(null); setMemory(null); setStorage(null); }
    if (activeStep > 0) { setColor(null); setChip(null); setChipVariant(null); setMemory(null); setStorage(null); setActiveStep(0); }
  };
  const handleColor   = (c) => {
    setColor(c);
    if (activeStep > 1) { setChip(null); setChipVariant(null); setMemory(null); setStorage(null); setActiveStep(1); }
  };
  const handleChip    = (c) => {
    applyChip(c, null);
    if (activeStep > 2) { setMemory(null); setStorage(null); setActiveStep(2); }
  };
  const handleVariant = (v) => {
    setChipVariant(v);
    if (activeStep > 2) { setMemory(null); setStorage(null); setActiveStep(2); }
  };
  const handleMemory = (m) => {
    setMemory(m);
  };

  const openModal = (targetChipId, targetMem, targetStor) => {
    const nc   = CHIP_BY_ID[targetChipId];
    const ncv  = nc.variants[0];
    const mOpts = MEM[targetChipId];
    const sOpts = STOR[targetChipId];

    const nm = targetMem
      ? (mOpts.find(m => m.l === targetMem) ?? mOpts[0])
      : mOpts[0];

    let ns;
    if (targetStor) {
      ns = sOpts.find(s => s.l === targetStor) ?? sOpts[0];
    } else if (storage) {
      ns = sOpts.find(s => s.l === storage.l) ?? sOpts[0];
    } else {
      ns = sOpts[0];
    }

    const changes = [];
    if (nc.id !== chip?.id) {
      changes.push({ label: "Chip", from: chip?.name ?? "—", to: nc.name });
    }
    const storageForced = storage && !STOR[targetChipId].some(s => s.l === storage.l);
    if (targetStor || storageForced) {
      changes.push({
        label: "Storage",
        from: storage ? storage.l + " SSD" : "—",
        to: ns.l + " SSD",
      });
    }

    const oldStorP = storage?.p ?? 0;
    const oldTotal = (size?.basePrice ?? 0) + (chip?.basePrice ?? 0) + (chipVariant?.price ?? 0) + (memory?.p ?? 0) + oldStorP;
    const newTotal = (size?.basePrice ?? 0) + nc.basePrice + ncv.price + nm.p + ns.p;

    setModal({
      targetLabel: targetMem ?? targetStor,
      nc, ncv, nm, ns,
      changes,
      oldTotal, newTotal,
      diff: newTotal - oldTotal,
    });
  };

  const acceptModal = () => {
    const wasMemExpanded  = memExpanded;
    const wasStorExpanded = storExpanded;
    applyChip(modal.nc, modal.ncv);
    setMemory(modal.nm);
    setStorage(modal.ns);
    setMemExpanded(wasMemExpanded);
    setStorExpanded(wasStorExpanded);
    setModal(null);
  };

  const availChips = size?.id === "16" ? CHIPS.filter(c => c.id !== "b6") : CHIPS;
  const memOpts    = chip ? MEM[chip.id]        : [];
  const storOpts   = chip ? STOR[chip.id]       : [];
  const memExtra   = chip ? MEM_EXTRA[chip.id]  : [];
  const storExtra  = chip ? STOR_EXTRA[chip.id] : [];
  const total      = (size?.basePrice ?? 0) + (chip?.basePrice ?? 0) + (chipVariant?.price ?? 0) + (memory?.p ?? 0) + (storage?.p ?? 0);
  const gst        = Math.round((total / 11) * 100) / 100;

  // ── Hero image: default to bbp-all.png, switch on colour selection ──────────
  const heroImage =
    color?.id === "silver" ? "assets/bbp-silver.png" :
    color?.id === "black"  ? "assets/bbp-black.png"  :
    "assets/bbp-all.png";

  const pillBtn = {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "8px 16px", borderRadius: 980,
    background: "#fff", border: `1px solid ${BORDER}`,
    fontSize: 13, color: T1, cursor: "pointer", letterSpacing: "-0.01em",
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif", color: T1, WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" }}>
      <style>{GS}</style>

      {/* ── MODAL ────────────────────────────────────────────────────────── */}
      {modal && (
        <div onClick={() => setModal(null)} style={{
          position: "fixed", inset: 0, zIndex: 600,
          background: "rgba(0,0,0,0.36)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
          animation: "overlayIn 0.3s ease",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 20, padding: "34px",
            maxWidth: 580, width: "100%",
            boxShadow: "0 24px 64px rgba(0,0,0,0.16)",
            animation: "modalIn 0.38s cubic-bezier(0.22,1,0.36,1)",
          }}>
            <h3 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.018em", lineHeight: 1.15 }}>Review changes to your configuration</h3>
            <p style={{ fontSize: 14, color: T2, margin: "0 0 24px", lineHeight: 1.55 }}>
              Selecting {modal.targetLabel} requires the following changes. Review before accepting.
            </p>

            <div style={{ background: GRAY, borderRadius: 16, padding: "20px 22px", marginBottom: 24 }}>
              {/* Column headers */}
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr", marginBottom: 14 }}>
                <div />
                <div style={{ fontSize: 11, color: T2, fontWeight: 500 }}>Current</div>
                <div style={{ fontSize: 11, color: T2, fontWeight: 500 }}>After change</div>
              </div>
              {/* Rows */}
              {modal.changes.map((ch, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "120px 1fr 1fr",
                  alignItems: "center",
                  paddingTop: i > 0 ? 14 : 0,
                  borderTop: i > 0 ? `1px solid ${BORDER}` : "none",
                }}>
                  <div style={{ fontSize: 12, color: T2, fontWeight: 500 }}>{ch.label}</div>
                  <div style={{ fontSize: 14, color: T2 }}>{ch.from}</div>
                  <div style={{ fontSize: 14, color: T1, fontWeight: 600 }}>{ch.to}</div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              <div style={{ background: GRAY, borderRadius: 12, padding: "16px 18px" }}>
                <div style={{ fontSize: 11, color: T2, marginBottom: 6 }}>Current total</div>
                <div style={{ fontSize: 20, fontWeight: 600, color: T2, letterSpacing: "-0.016em" }}>{fmt(modal.oldTotal)}</div>
              </div>
              <div style={{ background: GRAY, borderRadius: 12, padding: "16px 18px" }}>
                <div style={{ fontSize: 11, color: T2, marginBottom: 6 }}>New total</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: T1, letterSpacing: "-0.016em" }}>{fmt(modal.newTotal)}</div>
                {modal.diff !== 0 && <div style={{ fontSize: 12, color: T2, marginTop: 3 }}>{modal.diff > 0 ? `+ ${fmt(modal.diff)}` : `− ${fmt(Math.abs(modal.diff))}`}</div>}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setModal(null)} style={{ flex:1, padding:"13px 0", borderRadius:980, background:GRAY, border:`1.5px solid ${BORDER}`, fontSize:14, fontWeight:500, cursor:"pointer", color:T1 }}>Cancel</button>
              <button onClick={acceptModal}          style={{ flex:1, padding:"13px 0", borderRadius:980, background:P,    border:"none",                  fontSize:14, fontWeight:600, cursor:"pointer", color:"#fff" }}>Accept changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── SCROLL HEADER ────────────────────────────────────────────────── */}
      {showScrollHdr && (
        <div style={{
          position: "sticky", top: 0, zIndex: 200,
          background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${BORDER}`,
          height: 55,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px",
          animation: "hdrSlide 0.3s cubic-bezier(0.22,1,0.36,1)",
        }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: T1 }}>BoibyBook Pro</span>
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 20 }}>
            {!isMobile && <>
              <span style={{ fontSize: 13, color: T2 }}>Delivery: <span style={{ color: T1, fontWeight: 500 }}>Available</span></span>
              <span style={{ fontSize: 13, color: T2 }}>6-hour delivery (Free)</span>
            </>}
            <span style={{ fontSize: 16, fontWeight: 700, color: T1, letterSpacing: "-0.01em" }}>{size ? fmt(total) : `From ${fmtInt(2599)}`}</span>
          </div>
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div ref={heroRef} style={{ padding: isMobile ? "28px 20px 24px" : "40px 48px 36px", borderBottom: `1px solid ${BORDER}`, display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: T2, margin: "0 0 8px", letterSpacing: "0.005em" }}>New</p>
          <h1 style={{ fontSize: isMobile ? 32 : 40, fontWeight: 700, color: T1, margin: "0 0 12px", lineHeight: 1.1 }}>BoibyBook Pro</h1>
          <p style={{ fontSize: 15, color: T2, margin: "0 0 3px", letterSpacing: "-0.01em" }}>Pre-order new models now.</p>
          <p style={{ fontSize: 15, color: T2, margin: "0 0 3px", letterSpacing: "-0.01em" }}>Available starting 11.3.</p>
          <p style={{ fontSize: 15, color: T1, margin: "0 0 12px", fontWeight: 500, letterSpacing: "-0.005em" }}>{size ? fmt(total) : `From ${fmtInt(2599)}`}</p>
        </div>
        {!isMobile && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
            <button style={{ ...pillBtn }}>Add a trade-in to save on your new BoibyBook ›</button>
            <button style={{ ...pillBtn }}>Pay monthly with financing options ›</button>
          </div>
        )}
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", width: "100%", alignItems: "flex-start", paddingLeft: '5%', paddingRight: '5%' }}>

        {/* LEFT — sticky visual panel (hidden on mobile) */}
        {!isMobile && (
          <div style={{
            flex: "1",
            position: "sticky",
            top: NAV_H + (showScrollHdr ? 52 : 0),
            height: `calc(100vh - ${NAV_H + (showScrollHdr ? 52 : 0)}px)`,
            background: '#ffffff',
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "top 0.3s ease, height 0.3s ease",
            overflow: "hidden",
          }}>
            <div style={{
              flex: "1",
              marginTop: 'auto',
              marginBottom: 'auto',
              marginLeft: '48px',
              minHeight: '85vh',
              height: '85vh',
              background: GRAY,
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
              borderRadius: '20px',
            }}>
              {/* Image swaps based on colour selection; key forces re-mount for fade-in */}
              <img
                key={heroImage}
                src={heroImage}
                alt={color ? `BoibyBook Pro in ${color.name}` : "BoibyBook Pro"}
                style={{
                  width: "70%",
                  maxHeight: "70%",
                  objectFit: "contain",
                  animation: "imgFade 0.35s ease",
                }}
              />
            </div>
          </div>
        )}

        {/* RIGHT — config sections */}
        <div style={{ flex: isMobile ? "0 0 100%" : "0 0 540px", minWidth: 0, paddingRight: 0, paddingLeft: 60 }}>

          {/* MODEL */}
          <Section refProp={rModel} locked={false} isMobile={isMobile}>
            <SecTitle bold="Model." light="Choose your size." />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SIZES.map(s => (
                <OptionCard key={s.id} selected={size === s} onClick={() => handleSize(s)}>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 600, color: T1, marginBottom: 3, letterSpacing: "-0.012em" }}>{s.label}</div>
                    <div style={{ fontSize: 14, color: T2, lineHeight: 1.5 }}>{s.note}</div>
                  </div>
                  <Price fromTotal={s.fromPrice} />
                </OptionCard>
              ))}
            </div>
          </Section>

          {/* COLOUR */}
          <Section refProp={rColour} locked={activeStep < 1} isMobile={isMobile}>
            <SecTitle bold="Colour." light="Pick your favourite." />
            <p style={{ fontSize: 16, fontWeight: 500, color: T1, margin: "0 0 16px", letterSpacing: "-0.005em" }}>
              {color ? `Colour — ${color.name}` : "Select a colour"}
            </p>
            <div style={{ display: "flex", gap: 14 }}>
              {COLORS.map(c => (
                <button key={c.id} onClick={() => handleColor(c)} title={c.name} style={{
                  width: 30, height: 30, borderRadius: "50%", background: c.hex,
                  border: `2.5px solid ${color === c ? P : "transparent"}`,
                  outline: `1.5px solid ${color === c ? "transparent" : BORDER}`,
                  outlineOffset: 2, cursor: "pointer", padding: 0,
                  transition: "border-color 0.35s ease, outline-color 0.35s ease",
                }} />
              ))}
            </div>
          </Section>

          {/* CHIP */}
          <Section refProp={rChip} locked={activeStep < 2} isMobile={isMobile}>
            <SecTitle bold="Chip." light="Choose from these powerful options." />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {availChips.map(c => {
                const sel = chip === c;
                return (
                  <div key={c.id}>
                    <OptionCard selected={sel} onClick={() => handleChip(c)}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {c.badge && (
                          <div style={{ fontSize: 12, fontWeight: 600, color: ORANGE, marginBottom: 4, letterSpacing: "0.005em" }}>
                            {c.badge}
                          </div>
                        )}
                        <div style={{ fontSize: 17, fontWeight: 600, color: T1, marginBottom: 4, letterSpacing: "-0.01em" }}>{c.name}</div>
                        <div style={{ fontSize: 14, color: T2, lineHeight: 1.5, marginBottom: c.spec ? 3 : 0 }}>{c.desc}</div>
                        {c.spec && <div style={{ fontSize: 12, color: T2 }}>{c.spec}</div>}
                      </div>
                      <Price fromTotal={(size?.basePrice ?? 0) + c.basePrice} />
                    </OptionCard>

                    {sel && !c.isAuto && (
                      <div style={{
                        background: GRAY, borderRadius: 12, padding: "18px",
                        marginTop: 8, marginLeft: 8,
                        animation: "varIn 0.35s cubic-bezier(0.22,1,0.36,1)",
                      }}>
                        <p style={{ fontSize: 15, fontWeight: 600, color: T1, margin: "0 0 14px", letterSpacing: "-0.012em" }}>Select your processing power.</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {c.variants.map(v => (
                            <OptionCard key={v.id} selected={chipVariant === v} onClick={() => handleVariant(v)}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: T1, marginBottom: 3, letterSpacing: "-0.012em" }}>{v.label}</div>
                                <div style={{ fontSize: 13, color: T2 }}>{v.sub}</div>
                                {v.detail && <div style={{ fontSize: 13, color: T2, marginTop: 4, lineHeight: 1.45 }}>{v.detail}</div>}
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

              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:GRAY, borderRadius:12, padding:"16px 18px", marginTop:4 }}>
                <div>
                  <div style={{ fontSize:15, fontWeight:500, color:T1, marginBottom:3, letterSpacing:"-0.012em" }}>Need help choosing a chip?</div>
                  <div style={{ fontSize:13, color:T2, lineHeight:1.5 }}>Compare the options and discover which one is best for you.</div>
                </div>
                <span style={{ fontSize:22, color:T2, marginLeft:16, lineHeight:1, flexShrink:0 }}>⊕</span>
              </div>
            </div>
          </Section>

          {/* CUSTOMISATIONS */}
          <Section refProp={rMemory} locked={activeStep < 3} isMobile={isMobile}>
            <SecTitle bold="Customisations." light="Stay with the base model or make edits." />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* ── Memory card ── */}
              <div style={{ background: GRAY, borderRadius: 16, padding: "20px 22px" }}>
                {/* Header row */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 17, fontWeight: 600, color: T1, letterSpacing: "-0.013em" }}>Unified Memory</span>
                </div>
                <p style={{ fontSize: 13, color: T2, margin: "0 0 12px", lineHeight: 1.5 }}>
                  Add memory to run more apps simultaneously for faster, more fluid multitasking.
                </p>
                {memory && (
                  <>
                    <p style={{ fontSize: 13, color: T2, margin: "0 0 2px" }}>Current</p>
                    <p style={{ fontSize: 20, fontWeight: 700, color: T1, margin: "0 0 12px", letterSpacing: "-0.01em" }}>{memory.l}</p>
                  </>
                )}
                <div style={{ height: 1, background: BORDER, margin: "4px 0 14px" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: 13, color: T2, margin: 0, lineHeight: 1.5 }}>
                    Available in {(() => { const ls = memOpts.map(m => m.l); return ls.length <= 2 ? ls.join(" or ") : ls.slice(0,-1).join(", ") + ", or " + ls[ls.length-1]; })()} with your<br />current chip selection
                  </p>
                  <button
                    onClick={() => setMemExpanded(e => !e)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 16px", borderRadius: 980, flexShrink: 0, marginLeft: 12,
                      background: "#fff", border: `1.5px solid ${BORDER}`,
                      fontSize: 14, fontWeight: 500, color: T1, cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                </div>

                {/* Expanded options */}
                {memExpanded && (
                  <div style={{ marginTop: 16, animation: "varIn 0.3s cubic-bezier(0.22,1,0.36,1)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {memOpts.map(m => (
                        <OptionCard key={m.id} selected={memory === m} onClick={() => handleMemory(m)}>
                          <span style={{ fontSize: 17, fontWeight: 600, color: T1, letterSpacing: "-0.01em" }}>{m.l}</span>
                          <Price p={m.p} />
                        </OptionCard>
                      ))}
                    </div>
                    {memExtra.length > 0 && (
                      <div style={{ marginTop: 12 }}>
                        <div style={{ background: "#ebebed", borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
                          <p style={{ fontSize: 14, fontWeight: 600, color: T1, margin: "0 0 3px", letterSpacing: "-0.012em" }}>Or choose from more options.</p>
                          <p style={{ fontSize: 13, color: T2, margin: 0, lineHeight: 1.5 }}>Available with a change to your chip. You'll be able to review before accepting.</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {memExtra.map((ex, i) => (
                            <OptionCard key={i} selected={false} onClick={() => openModal(ex.chip, ex.l, null)}>
                              <span style={{ fontSize: 16, fontWeight: 600, color: T1, letterSpacing: "-0.015em" }}>{ex.l}</span>
                              <span style={{ fontSize: 14, color: P, marginLeft: 16, whiteSpace: "nowrap", flexShrink: 0 }}>See pricing and changes</span>
                            </OptionCard>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── Storage card ── */}
              <div style={{ background: GRAY, borderRadius: 16, padding: "20px 22px" }}>
                {/* Header row */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 17, fontWeight: 600, color: T1, letterSpacing: "-0.013em" }}>SSD Storage</span>
                </div>
                <p style={{ fontSize: 13, color: T2, margin: "0 0 12px", lineHeight: 1.5 }}>
                  Get ample space and fast access to your apps, photos, movies, music and other files.
                </p>
                {storage && (
                  <>
                    <p style={{ fontSize: 13, color: T2, margin: "0 0 2px" }}>Current</p>
                    <p style={{ fontSize: 20, fontWeight: 700, color: T1, margin: "0 0 12px", letterSpacing: "-0.01em" }}>{storage.l}</p>
                  </>
                )}
                <div style={{ height: 1, background: BORDER, margin: "4px 0 14px" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: 13, color: T2, margin: 0, lineHeight: 1.5 }}>
                    Available in {storOpts[0]?.l} to {storOpts[storOpts.length - 1]?.l} with your<br />current chip selection
                  </p>
                  <button
                    onClick={() => setStorExpanded(e => !e)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 16px", borderRadius: 980, flexShrink: 0, marginLeft: 12,
                      background: "#fff", border: `1.5px solid ${BORDER}`,
                      fontSize: 14, fontWeight: 500, color: T1, cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                </div>

                {/* Expanded options */}
                {storExpanded && (
                  <div style={{ marginTop: 16, animation: "varIn 0.3s cubic-bezier(0.22,1,0.36,1)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {storOpts.map(s => (
                        <OptionCard key={s.id} selected={storage === s} onClick={() => { setStorage(s); }}>
                          <span style={{ fontSize: 16, fontWeight: 600, color: T1, letterSpacing: "-0.012em" }}>{s.l}</span>
                          <Price p={s.p} />
                        </OptionCard>
                      ))}
                    </div>
                    {storExtra.length > 0 && (
                      <div style={{ marginTop: 12 }}>
                        <div style={{ background: "#ebebed", borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
                          <p style={{ fontSize: 14, fontWeight: 600, color: T1, margin: "0 0 3px", letterSpacing: "-0.012em" }}>Or choose from more options.</p>
                          <p style={{ fontSize: 13, color: T2, margin: 0, lineHeight: 1.5 }}>Available with a change to your chip. You'll be able to review before accepting.</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {storExtra.map((ex, i) => (
                            <OptionCard key={i} selected={false} onClick={() => openModal(ex.chip, null, ex.l)}>
                              <span style={{ fontSize: 16, fontWeight: 600, color: T1, letterSpacing: "-0.012em" }}>{ex.l}</span>
                              <span style={{ fontSize: 14, color: P, marginLeft: 16, whiteSpace: "nowrap", flexShrink: 0 }}>See pricing and changes</span>
                            </OptionCard>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </Section>

          {/* SUMMARY */}
          <Summary
            size={size} color={color} chip={chip} chipVariant={chipVariant}
            memory={memory} storage={storage} total={total} gst={gst} allDone={allDone}
            isMobile={isMobile}
          />
        </div>
      </div>

      {/* ── WHAT'S IN THE BOX ────────────────────────────────────────────── */}
      {size && chip && <WhatsInTheBox size={size} chip={chip} />}

      {/* ── FLOATING NEXT STEP BUTTON ────────────────────────────────────── */}
      {showNextBtn && (
        <div style={{
          position: "fixed",
          bottom: isMobile ? 0 : 32,
          right: isMobile ? 0 : 36,
          left: isMobile ? 0 : "auto",
          zIndex: 400,
          animation: "nextBtnIn 0.4s cubic-bezier(0.22,1,0.36,1)",
          padding: isMobile ? "12px 16px 20px" : 0,
          background: isMobile ? "rgba(255,255,255,0.95)" : "transparent",
          backdropFilter: isMobile ? "blur(12px)" : "none",
          borderTop: isMobile ? `1px solid ${BORDER}` : "none",
        }}>
          <button
            onClick={goNext}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              padding: "14px 22px", borderRadius: 980,
              width: isMobile ? "100%" : "auto",
              background: T1, color: "#fff", border: "none",
              fontSize: 15, fontWeight: 600, cursor: "pointer",
              letterSpacing: "-0.005em",
            }}
          >
            Next: {STEP_LABELS[activeStep]}
            <span style={{ fontSize: 18, lineHeight: 1 }}>→</span>
          </button>
        </div>
      )}
    </div>
  );
}