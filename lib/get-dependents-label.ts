import { Dependents } from "@/schemas/dependents.schema"

const DEPENDENTS_LABEL = ["0", "1", "2", "3 et +"] as const

export function getDependentsLabel(dependents: Dependents) {
  return DEPENDENTS_LABEL[dependents]
}
