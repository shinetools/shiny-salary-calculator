import localFont from "next/font/local"

export const fontSans = localFont({
  variable: "--font-sans",
  src: [
    {
      path: "./MabryPro-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./MabryPro-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
})

export const fontSerif = localFont({
  variable: "--font-serif",
  src: [
    {
      path: "./ValueSerifPro-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./ValueSerifPro-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
})
