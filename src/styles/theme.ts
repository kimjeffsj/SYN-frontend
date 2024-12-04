export const theme = {
  colors: {
    primary: {
      main: "#3D52A0",
      light: "#4B63B8",
      dark: "#2F407D",
    },
    secondary: {
      main: "#7091E6",
      light: "#8AA3E9",
      dark: "#5573C9",
    },
  },
} as const;

export type Theme = typeof theme;
