import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutral core, per brief: white / soft dark charcoal / light gray.
        paper: "#FAFAF9",
        ink: "#1C1B1A",       // soft dark charcoal, not pure black
        graphite: "#4A4744",  // secondary text
        mist: "#E8E6E3",      // light gray, borders/surfaces
        cloud: "#F2F1EE",     // subtle section backgrounds
        // Single accent — medium-dark blue, used for CTAs, highlights, motion accents.
        ember: "#2856C9",
        emberLight: "#5F8CFA",
        emberDeep: "#12245C",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        blobFloat: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(4%, -6%) scale(1.08)" },
          "66%": { transform: "translate(-3%, 4%) scale(0.95)" },
        },
        blobFloat2: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "40%": { transform: "translate(-6%, 5%) scale(1.1)" },
          "75%": { transform: "translate(5%, -3%) scale(0.92)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        wordUp: {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fadeIn 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "blob-float": "blobFloat 16s ease-in-out infinite",
        "blob-float-2": "blobFloat2 20s ease-in-out infinite",
        marquee: "marquee 22s linear infinite",
        "spin-slow": "spinSlow 14s linear infinite",
        "pulse-soft": "pulseSoft 2.4s ease-in-out infinite",
        "word-up": "wordUp 0.8s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
