import { Lang } from "@/app/[lang]/page"

export function translate(lang: Lang, locales: { fr: string; en?: string }) {
  return locales[lang]?.trim() || locales.fr
}
