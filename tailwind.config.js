/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./**/*.{tsx,ts,jsx,js}"],
    theme: {
      extend: {
        colors: {
          brand:          "#7c3aed",
          "brand-ring":   "rgba(124,58,237,0.18)",
          border:         "#d2d2d7",
          surface:        "#f5f5f7",
          t1:             "#1d1d1f",
          t2:             "#6e6e73",
          "accent-orange": "#bf4800",
          "accent-teal":   "#0071e3",
        },
        fontFamily: {
          sans: [
            "-apple-system",
            "BlinkMacSystemFont",
            "SF Pro Display",
            "SF Pro Text",
            "system-ui",
            "sans-serif",
          ],
        },
        borderRadius: {
          15: "15px",
          18: "18px",
          20: "20px",
        },
        transitionDuration: {
          350: "350ms",
          400: "400ms",
          550: "550ms",
        },
        animation: {
          "var-in":      "varIn 0.35s cubic-bezier(0.22,1,0.36,1)",
          "overlay-in":  "overlayIn 0.3s ease",
          "modal-in":    "modalIn 0.38s cubic-bezier(0.22,1,0.36,1)",
          "hdr-slide":   "hdrSlide 0.3s cubic-bezier(0.22,1,0.36,1)",
          "next-btn-in": "nextBtnIn 0.4s cubic-bezier(0.22,1,0.36,1)",
          "img-fade":    "imgFade 0.35s ease",
        },
        keyframes: {
          varIn:      { from: { opacity: "0", transform: "translateY(-6px)" }, to: { opacity: "1", transform: "translateY(0)" } },
          overlayIn:  { from: { opacity: "0" },                                to: { opacity: "1" } },
          modalIn:    { from: { opacity: "0" },                                to: { opacity: "1" } },
          hdrSlide:   { from: { opacity: "0", transform: "translateY(-100%)" }, to: { opacity: "1", transform: "translateY(0)" } },
          nextBtnIn:  { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
          imgFade:    { from: { opacity: "0" },                                to: { opacity: "1" } },
        },
      },
    },
    plugins: [],
  };