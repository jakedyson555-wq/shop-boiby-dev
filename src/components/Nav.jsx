import React, { useState, useRef, useEffect } from "react";

const NAV_ITEMS = [
  { label: "BoibyBook", href: "#" },
  { label: "bPhone",    href: "#" },
  { label: "bPad",      href: "#" },
  { label: "Watch",     href: "#" },
  { label: "Buds",      href: "#" },
  { label: "Services",  href: "#" },
  { label: "Accessories", href: "#" },
  { label: "Support",   href: "#" },
];

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const BagIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M2 4.5h11l-1.5 8H3.5L2 4.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M5 4.5V3.5a2.5 2.5 0 0 1 5 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* Nav bar — boiby-glass is your @utility: sticky, blur, border */}
      <nav className="boiby-glass">
        {/* boiby-container is your @utility: max-w-[1100px] + px-6 */}
        <div className="boiby-container flex items-center justify-between h-nav">

          {/* Logo */}
          <a
            href="#"
            aria-label="Boiby Home"
            className="flex-shrink-0 flex items-center opacity-80 hover:opacity-100 transition-opacity duration-200"
          >
            <img src="/boibylongdark.png" alt="Boiby" className="h-5 w-auto block" />
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center flex-1 justify-center list-none">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setActiveItem(item.label)}
                  className={[
                    "block px-2.5 text-[12px] font-normal tracking-tight h-nav leading-nav",
                    "transition-colors duration-150 relative group whitespace-nowrap flex items-center",
                    activeItem === item.label
                      ? "text-boiby-black"
                      : "text-ui-text-secondary hover:text-boiby-black",
                  ].join(" ")}
                >
                  {item.label}
                  <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-3 h-px bg-boiby-black rounded-full scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-40 transition-all duration-200 origin-center" />
                </a>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              aria-label="Search"
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-full text-ui-text-secondary hover:text-boiby-black hover:bg-boiby-black/5 transition-all duration-150"
            >
              <SearchIcon />
            </button>

            <button
              aria-label="Shopping Bag"
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-full text-ui-text-secondary hover:text-boiby-black hover:bg-boiby-black/5 transition-all duration-150"
            >
              <BagIcon />
            </button>

            {/* Hamburger */}
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] rounded-full hover:bg-boiby-black/5 transition-colors duration-150"
            >
              <span className={[
                "block w-[18px] h-[1.5px] bg-boiby-black rounded-full transition-all duration-200 origin-center",
                menuOpen ? "translate-y-[6.5px] rotate-45" : "",
              ].join(" ")} />
              <span className={[
                "block w-[18px] h-[1.5px] bg-boiby-black rounded-full transition-all duration-200",
                menuOpen ? "opacity-0 scale-x-0" : "",
              ].join(" ")} />
              <span className={[
                "block w-[18px] h-[1.5px] bg-boiby-black rounded-full transition-all duration-200 origin-center",
                menuOpen ? "-translate-y-[6.5px] -rotate-45" : "",
              ].join(" ")} />
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={[
          "md:hidden fixed inset-0 top-nav z-40",
          "transition-all duration-300 ease-in-out",
          menuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-1.5",
        ].join(" ")}
        style={{
          background: "rgba(251, 251, 253, 0.92)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        <ul className="list-none py-5">
          {NAV_ITEMS.map((item, i) => (
            <li
              key={item.label}
              className="border-b border-boiby-black/[0.06] first:border-t"
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(-4px)",
                transition: `opacity 0.25s ease ${i * 30}ms, transform 0.25s ease ${i * 30}ms`,
              }}
            >
              <a
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-3.5 text-[17px] font-normal tracking-tight text-ui-text-secondary hover:text-boiby-black transition-colors duration-150"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}