/**
 * A single primary spec item: a bold label with an optional smaller sub-line.
 * e.g. { label: "Boiby B6 chip", sub: "12-core CPU, 12-core GPU, 18-core NPU" }
 */
export interface SpecItem {
    label: string;
    sub?:  string;
  }
  
  /**
   * A group of SpecItems separated from other groups by a horizontal divider.
   * Typically: [chip group] | [memory, storage, adapter group] | [tech spec group]
   */
  export interface SpecGroup {
    items: SpecItem[];
    /** When true, item labels render at 13px/gray (tech specs style). */
    small?: boolean;
  }
  
  interface SummarySpecCardProps {
    /** Bold product name at the top, e.g. "14-inch BoibyBook Pro". */
    productName: string;
    /** Muted colour/variant name beneath the product name. */
    colorName:   string;
    /** Ordered groups — each group is separated by a divider line. */
    specGroups:  SpecGroup[];
  }
  
  /**
   * Generic gray card that lists the chosen configuration.
   * Build `specGroups` in your configurator root or section and pass them in —
   * this component has no knowledge of any specific product or data shape.
   */
  export function SummarySpecCard({ productName, colorName, specGroups }: SummarySpecCardProps) {
    return (
      <div className="bg-surface rounded-[18px] p-[22px_22px_18px] mb-8">
        {/* Product identity */}
        <p className="text-[18px] font-bold text-t1 tracking-[-0.01em]">{productName}</p>
        <p className="text-[14px] font-medium text-t2 pb-[12px] mb-[12px] border-b border-text-normal">{colorName}</p>
  
        {specGroups.map((group, gi) => (
          <div key={gi}>
            {group.items.map((item, ii) => (
              <div key={ii} className={gi === specGroups.length - 1 && ii === group.items.length - 1 ? "" : "mb-[10px]"}>
                {group.small ? (
                  <p className="text-[11px] text-t2 mt-1 leading-[1.35]">{item.label}</p>
                ) : (
                  <div>
                    <p className={`text-[14px] font-semibold text-t1 tracking-[-0.01em] ${item.sub ? "mb-0.5" : "m-0"}`}>
                      {item.label}
                    </p>
                    {item.sub && (
                      <p className="text-[12px] font-medium text-t2 mb-[10px]">{item.sub}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }