export const LANGS = ["fr", "en"] as const

export type Lang = (typeof LANGS)[number]
