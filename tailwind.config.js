/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3D52A0", // Main color
          50: "#F2F4F9",
          100: "#E5E9F2",
          200: "#C7D0E5",
          300: "#A9B7D8",
          400: "#8B9ECB",
          500: "#3D52A0", // Base
          600: "#314283",
          700: "#253166",
          800: "#182149",
          900: "#0C102C",
        },
        secondary: {
          DEFAULT: "#7091E6", // Secondary color
          50: "#F5F8FE",
          100: "#EBF0FD",
          200: "#D6E1FA",
          300: "#C2D2F8",
          400: "#ADC3F5",
          500: "#7091E6", // Base
          600: "#5A74B8",
          700: "#43578A",
          800: "#2C3A5C",
          900: "#151D2E",
        },
        success: {
          DEFAULT: "#10B981",
          50: "#F0FDF9",
          100: "#E1FCF4",
          500: "#10B981",
        },
        warning: {
          DEFAULT: "#F59E0B",
          50: "#FDF9EE",
          100: "#FCF3DD",
          500: "#F59E0B",
        },
        error: {
          DEFAULT: "#EF4444",
          50: "#FEF2F2",
          100: "#FEE2E2",
          500: "#EF4444",
        },
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
      },
      boxShadow: {
        card: "0 2px 6px 0 rgb(67 89 113 / 12%)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
