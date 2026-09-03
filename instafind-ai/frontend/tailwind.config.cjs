/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Geist", "sans-serif"],
      },
      colors: {
        dark: {
          bg: "#0a0a0f",
          card: "#14141f",
          border: "#2a2a3a",
          text: "#e8e8f0",
          muted: "#71717a",
          accent: "#00d4aa",
        },
        light: {
          bg: "#fafafa",
          card: "#ffffff",
          border: "#e0e0e0",
          text: "#111111",
          muted: "#6b6b6b",
          accent: "#059669",
        },
      },
    },
  },
  plugins: [],
};
