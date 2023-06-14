import { Dependents } from "@/schemas/dependents.schema"

import { Lang } from "@/app/[lang]/page"

const DEPENDENTS_LABEL = {
  fr: ["0", "1", "2", "3 et +"],
  en: ["0", "1", "2", "3 and +"],
} as const

export function getDependentsLabel(dependents: Dependents, lang: Lang) {
  return DEPENDENTS_LABEL[lang][dependents]
}
