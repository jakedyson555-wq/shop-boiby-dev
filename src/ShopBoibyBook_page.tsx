import { useState } from "react";
import { useNavigate } from "react-router-dom";

import imgBbaAll      from "./assets/bba_all.png";
import imgBbaLightBlue from "./assets/bba_lightblue.png";
import imgBbaSoftPink  from "./assets/bba_softpink.png";
import imgBbaSilver    from "./assets/bba_silver.png";
import imgBbaSlate     from "./assets/bba_slate.png";

import imgBbpAll    from "./assets/bbp-all.png";
import imgBbpSilver from "./assets/bbp-silver.png";
import imgBbpBlack  from "./assets/bbp-black.png";

const AIR_COLORS = [
  { id: "lightblue", name: "Light Blue", hex: "#a8c5e0", img: imgBbaLightBlue },
  { id: "softpink",  name: "Soft Pink",  hex: "#e8b4b8", img: imgBbaSoftPink  },
  { id: "silver",    name: "Silver",     hex: "#c8c8ca", img: imgBbaSilver    },
  { id: "slate",     name: "Slate",      hex: "#616977", img: imgBbaSlate     },
];

const PRO_COLORS = [
  { id: "black",  name: "Space Black", hex: "#3a3a3c", img: imgBbpBlack  },
  { id: "silver", name: "Silver",      hex: "#c8c8ca", img: imgBbpSilver },
];

function ProductCard({
  badge,
  name,
  fromPrice,
  colors,
  defaultImg,
  href,
}: {
  badge:      string;
  name:       string;
  fromPrice:  string;
  colors:     { id: string; name: string; hex: string; img: string }[];
  defaultImg: string;
  href:       string;
}) {
  const navigate = useNavigate();
  const [activeColor, setActiveColor] = useState<string | null>(null);

  const currentImg = activeColor
    ? (colors.find(c => c.id === activeColor)?.img ?? defaultImg)
    : defaultImg;

  return (
    <div className="bg-white rounded-[18px] p-6 flex flex-col" style={{ minHeight: 420 }}>
      <div className="text-[13px] font-semibold text-accent-orange tracking-[0.04em] uppercase mb-[6px]">
        {badge}
      </div>
      <div className="text-[26px] font-bold text-t1 tracking-[-0.018em] mb-4">
        {name}
      </div>

      {/* Product image */}
      <div className="flex-1 flex items-center justify-center py-4">
        <img
          key={currentImg}
          src={currentImg}
          alt={name}
          className="w-full max-w-[280px] max-h-[180px] object-contain animate-img-fade"
        />
      </div>

      {/* Colour dots */}
      <div className="flex justify-center gap-[10px] mb-5">
        {colors.map(c => (
          <button
            key={c.id}
            title={c.name}
            onClick={() => setActiveColor(c.id)}
            className="w-[10px] h-[10px] rounded-full p-0 cursor-pointer transition-[border-color,outline-color] duration-200"
            style={{
              background:    c.hex,
              border:        `2px solid ${activeColor === c.id ? "#7c3aed" : "transparent"}`,
              outline:       `1.5px solid ${activeColor === c.id ? "transparent" : "#c7c7cc"}`,
              outlineOffset: "2px",
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-medium text-t2">{fromPrice}</span>
        <button
          onClick={() => navigate(href)}
          className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-[14px] font-semibold px-5 py-2 rounded-full transition-colors duration-200"
        >
          Buy
        </button>
      </div>
    </div>
  );
}

export default function ShopBoibyBook() {
  return (
    <div className="min-h-screen font-sans antialiased" style={{ background: "#f5f5f7" }}>
      <div className="max-w-[980px] mx-auto px-6 py-14">

        {/* Page title */}
        <h1 className="text-[48px] font-bold text-t1 tracking-[-0.025em] mb-10">
          Shop BoibyBook
        </h1>

        {/* All models */}
        <div className="mb-12">
          <p className="text-[21px] font-semibold text-t1 tracking-[-0.01em] mb-5">
            All models.{" "}
            <span className="font-normal text-t2">Take your pick.</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ProductCard
              badge="New"
              name="BoibyBook Air"
              fromPrice="From $1,699"
              colors={AIR_COLORS}
              defaultImg={imgBbaAll}
              href="/boibybook-air"
            />
            <ProductCard
              badge="New"
              name="BoibyBook Pro"
              fromPrice="From $2,599"
              colors={PRO_COLORS}
              defaultImg={imgBbpAll}
              href="/boibybook-pro"
            />
          </div>
        </div>

        {/* Shopping guides */}
        <div>
          <p className="text-[21px] font-semibold text-t1 tracking-[-0.01em] mb-5">
            Shopping guides.{" "}
            <span className="font-normal text-t2">Can't decide? Start here.</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                tag:   "COMPARE ALL MODELS",
                title: "Which BoibyBook is right for you?",
              },
              {
                tag:   "WHY BOIBYBOOK",
                title: "The most personal computers we've ever made.",
              },
              {
                tag:   "BOIBY INTELLIGENCE",
                title: "Create, communicate and get things done effortlessly.",
                accent: true,
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white rounded-[18px] p-6 flex flex-col cursor-pointer hover:shadow-md transition-shadow duration-200"
                style={{ minHeight: 180 }}
              >
                <div className={`text-[11px] font-semibold tracking-[0.06em] uppercase mb-2 ${card.accent ? "text-[#7c3aed]" : "text-t2"}`}>
                  {card.tag}
                </div>
                <div className={`text-[19px] font-bold tracking-[-0.015em] leading-[1.25] ${card.accent ? "text-[#7c3aed]" : "text-t1"}`}>
                  {card.title}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}