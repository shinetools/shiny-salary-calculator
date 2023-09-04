import { fontFamily } from "tailwindcss/defaultTheme"

export const shinePalette = {
  blue: {
    100: "#FBFCFE",
    200: "#EEF5FB",
    300: "#E0F0FF",
    400: "#C7E4FF",
    500: "#8BC7FF",
    600: "#2A93F4",
    700: "#087CBF",
    800: "#2B464D",
  },
  green: {
    100: "#FAFFF5",
    200: "#F0FCE4",
    300: "#E7F9D2",
    400: "#C9EBA3",
    500: "#A4D36E",
    600: "#56AA41",
    700: "#496728",
    800: "#384B23",
  },
  grey: {
    100: "#FCFBF8",
    200: "#F6F5EF",
    300: "#F0EFE4",
    400: "#DEDCCE",
    500: "#B6B4AA",
    600: "#7F7B71",
    700: "#555249",
    800: "#25241D",
  },
  orange: {
    100: "#FEFAF5",
    200: "#FEF3E6",
    300: "#FFE6C9",
    400: "#FFC9A3",
    500: "#FF9F6B",
    600: "#F4722A",
    700: "#B64617",
    800: "#893815",
  },
  red: {
    100: "#FFFBFA",
    200: "#FFF2F0",
    300: "#FFE1DD",
    400: "#FBC2B6",
    500: "#F99D8F",
    600: "#DC4C56",
    700: "#9E3D3D",
    800: "#843435",
  },
  yellow: {
    100: "#FFFDF5",
    200: "#FEFAE2",
    300: "#FFF5D2",
    400: "#FCF0B6",
    500: "#FFEB85",
    600: "#FEE827",
    700: "#8E6A15",
    800: "#47350B",
  },
}

const tailwindConfig = {
  content: [
    "app/**/*.{ts,tsx}",
    "pages/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "views/**/*.{ts,tsx}",
  ],
  theme: {
    colors: {
      border: shinePalette.grey[300],
      input: shinePalette.grey[400],
      ring: shinePalette.blue[500],
      background: shinePalette.grey[200],
      foreground: shinePalette.grey[800],
      primary: {
        DEFAULT: shinePalette.grey[800],
        foreground: shinePalette.grey[100],
      },
      secondary: {
        DEFAULT: shinePalette.grey[200],
        foreground: shinePalette.grey[800],
      },
      destructive: {
        DEFAULT: shinePalette.orange[600],
        foreground: shinePalette.red[100],
      },
      muted: {
        DEFAULT: shinePalette.grey[300],
        foreground: shinePalette.grey[600],
      },
      accent: {
        DEFAULT: shinePalette.grey[300],
        foreground: shinePalette.grey[800],
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
      transparent: "transparent",
      white: "#FFF",
      ...shinePalette,
    },

    extend: {
      fontSize: {
        "2xl": "26px",
        "4xl": "40px",
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        serif: ["var(--font-serif)", ...fontFamily.serif],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}

export default tailwindConfig
