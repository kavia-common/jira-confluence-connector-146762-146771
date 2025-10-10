import type { Config } from "tailwindcss";

/**
 * PUBLIC_INTERFACE
 * Tailwind configuration for Ocean Professional theme.
 * Note: Using TailwindCSS v4 with @tailwindcss/postcss. This file is optional,
 * but we provide container and theme extensions for reference. Keep config lean.
 */
const config: Partial<Config> = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        amber: "#F59E0B",
        background: "#f9fafb",
        surface: "#ffffff",
        text: "#111827",
        error: "#EF4444",
      },
      borderRadius: {
        lg: "0.75rem",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1.5rem", // px-6
          md: "2rem",        // md:px-8
          lg: "2.5rem",      // lg:px-10
        },
      },
    },
  },
  // Dark mode not assumed unless implemented explicitly
  darkMode: "class",
};

export default config as Config;
