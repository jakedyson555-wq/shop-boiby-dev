// ── BoibyBook Pro — product data ──────────────────────────────────────────────
// All product-specific constants live here so the UI components stay generic
// and can be wired up to a different data file for another product line.

import type { SizeOption, ColorOption, ChipOption, MemOption, StorOption, ExtraOption } from "../../types";

export const SIZES: SizeOption[] = [
  { id: "14", label: "14-inch", note: "B6, B6 Pro or B6 Max chip.", basePrice: 2599, fromPrice: 2599 },
  { id: "16", label: "16-inch", note: "B6 Pro or B6 Max chip.",     basePrice: 3099, fromPrice: 3999 },
];

export const COLORS: ColorOption[] = [
  { id: "black",  name: "Space Black", hex: "#3a3a3c" },
  { id: "silver", name: "Silver",      hex: "#c8c8ca" },
];

export const CHIPS: ChipOption[] = [
  {
    id: "b6", name: "B6 chip", badge: "New",
    desc: "Exceptional performance for everyday professional and creative tasks.",
    spec: "12-core CPU, 18-core GPU",
    basePrice: 0, isAuto: true,
    variants: [
      { id: "b6v0", label1: "16-core CPU,", label2: "19-core GPU", sub: "18-core NPU", price: 0 },
    ],
  },
  {
    id: "b6pro", name: "B6 Pro chip", badge: "New",
    desc: "More performance and higher memory options for demanding workflows.",
    spec: "2 options available",
    basePrice: 900, isAuto: false,
    variants: [
      { id: "bp0", label1: "16-core CPU,", label2: "19-core GPU", sub: "18-core NPU", price: 0,   detail: null },
      { id: "bp1", label1: "18-core CPU,", label2: "24-core GPU", sub: "18-core NPU", price: 400, detail: "Boost your processing and graphics performance." },
    ],
  },
  {
    id: "b6max", name: "B6 Max chip", badge: "New",
    desc: "Our most advanced chip ever. Made to power the most extreme workflows.",
    spec: "2 options available",
    basePrice: 3100, isAuto: false,
    variants: [
      { id: "bm0", label1: "18-core CPU,", label2: "38-core GPU", sub: "18-core NPU", price: 0,   detail: null },
      { id: "bm1", label1: "18-core CPU,", label2: "48-core GPU", sub: "18-core NPU", price: 600, detail: "Boost your graphics performance." },
    ],
  },
];

export const CHIP_BY_ID: Record<string, ChipOption> =
  Object.fromEntries(CHIPS.map(c => [c.id, c]));

export const MEM: Record<string, MemOption[]> = {
  b6:    [{ id: "m16",  l: "16GB",  p: 0    }, { id: "m24",  l: "24GB",  p: 200  }, { id: "m32a", l: "32GB",  p: 400  }],
  b6pro: [{ id: "m24b", l: "32GB",  p: 0    }, { id: "m48",  l: "48GB",  p: 400  }, { id: "m64",  l: "64GB",  p: 800  }],
  b6max: [{ id: "m48x", l: "48GB",  p: 0    }, { id: "m64x", l: "64GB",  p: 400  }, { id: "m128", l: "128GB", p: 2000 }],
};

export const MEM_EXTRA: Record<string, ExtraOption[]> = {
  b6:    [{ l: "48GB", chip: "b6pro" }, { l: "64GB", chip: "b6pro" }, { l: "128GB", chip: "b6max" }],
  b6pro: [{ l: "128GB", chip: "b6max" }],
  b6max: [],
};

export const STOR: Record<string, StorOption[]> = {
  b6:    [{ id: "s1a", l: "1TB", p: 0 }, { id: "s2a", l: "2TB", p: 200 }, { id: "s4a", l: "4TB", p: 600  }],
  b6pro: [{ id: "s1b", l: "1TB", p: 0 }, { id: "s2b", l: "2TB", p: 200 }, { id: "s4b", l: "4TB", p: 600  }],
  b6max: [{ id: "s2c", l: "2TB", p: 0 }, { id: "s4c", l: "4TB", p: 400 }, { id: "s8",  l: "8TB", p: 1200 }],
};

export const STOR_EXTRA: Record<string, ExtraOption[]> = {
  b6:    [{ l: "8TB", chip: "b6max" }],
  b6pro: [{ l: "8TB", chip: "b6max" }],
  b6max: [],
};