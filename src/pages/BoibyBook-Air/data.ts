import type {
  SizeOption,
  ColorOption,
  ChipOption,
  MemOption,
  StorOption,
  ExtraOption,
} from "../../types";

export const SIZES: SizeOption[] = [
  {
    id:        "13",
    label:     "13-inch",
    note:      "",
    basePrice: 1699,
    fromPrice: 1699,
  },
  {
    id:        "15",
    label:     "15-inch",
    note:      "",
    basePrice: 2099,
    fromPrice: 2099,
  },
];

export const COLORS: ColorOption[] = [
  { id: "lightblue", name: "Blue", hex: "#98aac8" },
  { id: "softpink",  name: "Pink",  hex: "#e19dab" },
  { id: "silver",    name: "Silver",     hex: "#c8c8ca" },
  { id: "slate",     name: "Grey",      hex: "#767676" },
];

export const CHIPS: ChipOption[] = [
  {
    id:        "b6_11",
    name:      "B6 chip",
    badge:     "New",
    desc:      "Exceptional performance for everyday tasks.",
    spec:      "11-core CPU, 10-core GPU",
    basePrice: 0,
    isAuto:    true,
    variants: [
      {
        id:     "b6_11v0",
        label1: "11-core CPU,",
        label2: "10-core GPU",
        sub:    "16-core Neural Engine",
        price:  0,
      },
    ],
  },
  {
    id:        "b6_12",
    name:      "B6 chip",
    badge:     "New",
    desc:      "Give a boost to more intensive tasks with more processing and graphics rendering speed.",
    spec:      "12-core CPU, 12-core GPU",
    basePrice: 100,
    isAuto:    true,
    variants: [
      {
        id:     "b6_12v0",
        label1: "12-core CPU,",
        label2: "12-core GPU",
        sub:    "16-core Neural Engine",
        price:  0,
      },
    ],
  },
];

export const CHIP_BY_ID: Record<string, ChipOption> =
  Object.fromEntries(CHIPS.map(c => [c.id, c]));

// 15-inch auto-applies this zero-cost copy so the $100 upgrade is not
// double-counted against the size basePrice of $2099.
export const CHIP_15: ChipOption = { ...CHIPS[1], basePrice: 0 };

export const MEM: Record<string, MemOption[]> = {
  b6_11: [
    { id: "m16a", l: "16GB", p: 0   },
    { id: "m24a", l: "24GB", p: 200 },
  ],
  b6_12: [
    { id: "m16b", l: "16GB", p: 0   },
    { id: "m24b", l: "24GB", p: 200 },
    { id: "m32",  l: "32GB", p: 400 },
  ],
};

export const MEM_EXTRA: Record<string, ExtraOption[]> = {
  b6_11: [{ l: "32GB", chip: "b6_12" }],
  b6_12: [],
};

export const STOR: Record<string, StorOption[]> = {
  b6_11: [
    { id: "s512a", l: "512GB", p: 0   },
    { id: "s1a",   l: "1TB",   p: 100 },
  ],
  b6_12: [
    { id: "s512b", l: "512GB", p: 0   },
    { id: "s1b",   l: "1TB",   p: 100 },
    { id: "s2",    l: "2TB",   p: 300 },
    { id: "s4",    l: "4TB",   p: 700 },
  ],
};

export const STOR_EXTRA: Record<string, ExtraOption[]> = {
  b6_11: [{ l: "2TB", chip: "b6_12" }, { l: "4TB", chip: "b6_12" }],
  b6_12: [],
};