import "@/styles/globals.css"

import type { AppProps } from "next/app"
import { shinePalette } from "@/tailwind.config"

import { fontSans, fontSerif } from "@/lib/fonts"
import { cn } from "@/lib/utils"

const variables: Record<string, string> = {}

for (const [colorName, colorVariants] of Object.entries(shinePalette)) {
  for (const [variantName, variant] of Object.entries(colorVariants)) {
    variables[`--${colorName}-${variantName}`] = variant
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className={cn(
        "h-full font-sans antialiased",
        fontSans.variable,
        fontSerif.variable
      )}
      style={{
        ...variables,
      }}
    >
      <Component {...pageProps} />
    </main>
  )
}
