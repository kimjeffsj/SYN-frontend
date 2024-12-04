/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3D52A0",
          light: "#4B63B8",
          dark: "#2F407D",
        },
        secondary: {
          DEFAULT: "#7091E6",
          light: "#8AA3E9",
          dark: "#5573C9",
        },
      },
    },
  },
  plugins: [],
};
