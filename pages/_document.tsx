import { Head, Html, Main, NextScript } from "next/document"
import { shinePalette } from "@/tailwind.config"

const variables: Record<string, string> = {}

for (const [colorName, colorVariants] of Object.entries(shinePalette)) {
  for (const [variantName, variant] of Object.entries(colorVariants)) {
    variables[`--${colorName}-${variantName}`] = variant
  }
}

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
