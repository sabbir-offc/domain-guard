import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: "#29AAE1",
          "cyan-dark": "#1d8cbb",
          navy: "#0E1C42",
          "navy-light": "#1a2c5e"
        }
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif"
        ]
      },
      boxShadow: {
        glow: "0 0 0 3px rgba(41, 170, 225, 0.15)"
      }
    }
  },
  plugins: []
};

export default config;
