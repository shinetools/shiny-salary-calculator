import { NextRequest, NextResponse } from "next/server"

const parser = require("accept-language-parser")

let locales = ["fr", "en"]
let defaultLocale = "fr"

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (pathnameIsMissingLocale) {
    const locale =
      parser.pick(locales, request.headers.get("Accept-Language"), {
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
