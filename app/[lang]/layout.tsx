import "@/styles/globals.css"

import { Metadata } from "next"
import { shinePalette } from "@/tailwind.config"

import { siteConfig } from "@/config/site"
import { fontSans, fontSerif } from "@/lib/fonts"
import { cn } from "@/lib/utils"

const variables: Record<string, string> = {}

for (const [colorName, colorVariants] of Object.entries(shinePalette)) {
  for (const [variantName, variant] of Object.entries(colorVariants)) {
    variables[`--${colorName}-${variantName}`] = variant
  }
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: "white",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen font-sans antialiased",
            fontSans.variable,
            fontSerif.variable
          )}
          style={{
            ...variables,
          }}
        >
          {children}
        </body>
      </html>
    </>
  )
}
