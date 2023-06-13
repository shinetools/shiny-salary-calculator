import "@/styles/globals.css"

import { Metadata } from "next"
import { shinePalette } from "@/tailwind.config"

import { siteConfig } from "@/config/site"
import { fontSans, fontSerif } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { TailwindIndicator } from "@/components/tailwind-indicator"

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
      <html lang="en" suppressHydrationWarning>
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
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
          </div>
          <TailwindIndicator />
        </body>
      </html>
    </>
  )
}
