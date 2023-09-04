import { Lang } from "./locales"

export function translate(lang: Lang, locales: { fr: string; en?: string }) {
  return locales[lang]?.trim() || locales.fr
}
