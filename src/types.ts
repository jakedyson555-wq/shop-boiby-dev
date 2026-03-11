// ── Shared configurator types ─────────────────────────────────────────────────
// These are intentionally generic so they can be reused across different
// product configurators (e.g. BoibyBook Pro, BoibyBook Air, etc.)

export interface SizeOption {
  id:        string;
  label:     string;
  note:      string;
  basePrice: number;
  fromPrice: number;
}

export interface ColorOption {
  id:   string;
  name: string;
  hex:  string;
}

export interface ChipVariant {
  id:      string;
  label1:  string;
  label2:  string;
  sub:     string;
  price:   number;
  detail?: string | null;
}

export interface ChipOption {
  id:        string;
  name:      string;
  badge?:    string;
  desc:      string;
  spec?:     string;
  basePrice: number;
  isAuto:    boolean;
  variants:  ChipVariant[];
}

export interface MemOption {
  id: string;
  l:  string;
  p:  number;
}

export interface StorOption {
  id: string;
  l:  string;
  p:  number;
}

export interface ExtraOption {
  l:    string;
  chip: string;
}

export interface ModalData {
  targetLabel: string;
  nc:          ChipOption;
  ncv:         ChipVariant;
  nm:          MemOption;
  ns:          StorOption;
  changes:     Array<{ label: string; from: string; to: string }>;
  oldTotal:    number;
  newTotal:    number;
  diff:        number;
}