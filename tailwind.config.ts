import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f4f6f3",
        foreground: "#17201b",
        panel: "#ffffff",
        border: "#d7ded3",
        muted: "#6b756d",
        "muted-foreground": "#6b756d",
        accent: "#245c47",
        "accent-foreground": "#17201b",
        primary: "#245c47",
        "primary-foreground": "#ffffff",
        secondary: "#eef2ec",
        "secondary-foreground": "#17201b",
        card: "#ffffff",
        "card-foreground": "#17201b",
        popover: "#ffffff",
        "popover-foreground": "#17201b",
        ring: "#60a5fa",
        input: "#d7ded3",
        amber: "#c57a28",
        blue: "#2d5f88",
        danger: "#a33a2c"
      },
      boxShadow: {
        panel: "0 18px 50px rgba(23, 32, 27, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
