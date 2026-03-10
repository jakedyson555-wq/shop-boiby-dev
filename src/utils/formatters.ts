// ── Formatters ────────────────────────────────────────────────────────────────

export const fmt = (n: number): string =>
  `A$${n.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const fmtInt = (n: number): string =>
  `A$${n.toLocaleString("en-AU", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export const getAdapterLabel = (
  size: { id: string },
  chip: { id: string },
): string => {
  if (size.id === "14" && chip.id === "b6")                             return "90W USB-C Power Adapter";
  if (size.id === "16" && (chip.id === "b6pro" || chip.id === "b6max")) return "160W USB-C Power Adapter";
  return "120W USB-C Power Adapter";
};