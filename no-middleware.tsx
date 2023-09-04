import { NextRequest, NextResponse } from "next/server"

import { LANGS } from "./lib/locales"

const parser = require("accept-language-parser")

const defaultLocale = "fr"

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const pathnameIsMissingLocale = LANGS.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (pathnameIsMissingLocale) {
    const locale =
      parser.pick(LANGS, request.headers.get("Accept-Language"), {
        loose: true,
      }) || defaultLocale

    const searchParams = request.nextUrl.searchParams.toString()

    const url = new URL(
      `/${locale}/${pathname}${searchParams ? `?${searchParams}` : ""}`,
      request.url
    )

    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next), api and assets
    "/((?!(?:_next|api|assets|favicon.ico)).*)",
  ],
}
