/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
    "./src/app/**/*.{ts,tsx,js,jsx}",
    "./src/components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          50: "#EBF2FF",
          100: "#DCE8FE",
          200: "#BFD3FD",
          300: "#93B4FB",
          400: "#5E88F6",
          500: "#3B6FF1",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        secondary: { DEFAULT: "#F59E0B" },
        success: { DEFAULT: "#F59E0B" },
        error: { DEFAULT: "#EF4444" },
        ocean: {
          bg: "#f9fafb",
          surface: "#ffffff",
          text: "#111827",
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(17,24,39,0.06), 0 1px 2px rgba(17,24,39,0.04)",
        cardHover: "0 4px 12px rgba(17,24,39,0.10), 0 2px 6px rgba(17,24,39,0.06)",
      },
      borderRadius: {
        xl: "0.75rem",
      },
    },
  },
  plugins: [],
};
