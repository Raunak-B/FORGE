import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        iron: "#1B1D1F",
        chalk: "#EDE8DE",
        plate: "#C8362B",
        steel: "#4C5A66",
        brass: "#C99A3D",
      },
      fontFamily: {
        sans: ["var(--font-ibm-sans)", "sans-serif"],
        display: ["var(--font-big-shoulders)", "sans-serif"],
        mono: ["var(--font-ibm-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;