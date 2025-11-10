import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#0B0C10",
        primary: "#00FFD1",
        secondary: "#FF1493",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "neon-pulse": {
          "0%, 100%": { textShadow: "0 0 5px #00FFD1" },
          "50%": { textShadow: "0 0 15px #00FFD1" },
        },
        glitch: {
          "2%, 64%": { transform: "translate(2px, 0) skew(0deg)" },
          "4%, 60%": { transform: "translate(-2px, 0) skew(0deg)" },
          "62%": { transform: "translate(0, 0) skew(5deg)" },
        },
        scanline: {
          "0%": { backgroundPosition: "0 -100%" },
          "35%, 100%": { backgroundPosition: "0 100%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "neon-pulse": "neon-pulse 2s infinite",
        glitch: "glitch 1s linear infinite",
        scanline: "scanline 7.5s linear infinite",
      },
      fontFamily: {
        "press-start": ['"Press Start 2P"', "cursive"],
        vt323: ['"VT323"', "monospace"],
      },
      boxShadow: {
        neon: "0 0 10px #00FFD1, 0 0 20px #00FFD1, 0 0 40px #00FFD1",
        "neon-secondary":
          "0 0 10px #FF1493, 0 0 20px #FF1493, 0 0 40px #FF1493",
      },
      backgroundImage: {
        "grid-subtle":
          "linear-gradient(to right, rgba(0, 255, 209, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 209, 0.05) 1px, transparent 1px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
