interface BoxItem {
    /** Unique key for React. */
    key:   string;
    /** Label shown beneath the image placeholder. */
    label: string;
  }
  
  interface WhatsInTheBoxProps {
    /** Shown as the section title. */
    heading?: string;
    /** Items displayed under the image, in order. Build these in the root configurator. */
    items: BoxItem[];
  }
  
  /**
   * Generic "What's in the Box" section.
   * Fully prop-driven — pass `items` built from your product's data file
   * so this component has no knowledge of any specific product.
   *
   * @example
   * <WhatsInTheBox
   *   items={[
   *     { key: "laptop",  label: `${size.label} BoibyBook Pro` },
   *     { key: "cable",   label: "USB-C to BoibySafe 3 Cable (2 m)" },
   *     { key: "adapter", label: getAdapterLabel(size, chip) },
   *   ]}
   * />
   */
  export function WhatsInTheBox({ heading = "What's in the Box", items }: WhatsInTheBoxProps) {
    return (
      <div className="py-20 pb-[100px] bg-white border-t border-border">
        <h2 className="text-center text-[28px] font-bold text-t1 mb-12 tracking-[-0.01em]">
          {heading}
        </h2>
        <div className="max-w-[900px] mx-auto px-[60px]">
          {/* Image placeholder — swap for a real <img> or carousel when ready */}
          <div className="bg-surface rounded-3xl h-[280px]" />
          <div className="flex mt-5">
            {items.map(item => (
              <div key={item.key} className="flex-1 text-center">
                <p className="text-[13px] text-t2 m-0 leading-[1.5] px-4">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }