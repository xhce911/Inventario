import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#f7fafe",
        "surface-dim": "#d7dade",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f1f4f8",
        "surface-container": "#ebeef2",
        "surface-container-high": "#e5e8ec",
        "surface-container-highest": "#e0e3e7",
        "on-surface": "#181c1f",
        "on-surface-variant": "#424656",
        outline: "#737687",
        "outline-variant": "#c3c6d8",
        primary: "#004ccd",
        "on-primary": "#ffffff",
        secondary: "#bb0019",
        "on-secondary": "#ffffff",
        tertiary: "#304db9",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        success: "#167c38",
        warning: "#b45f06"
      },
      fontFamily: {
        display: ["Hanken Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      },
      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem"
      },
      boxShadow: {
        panel: "0 4px 18px rgba(24, 28, 31, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
