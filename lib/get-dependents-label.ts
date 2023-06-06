import { Dependents } from "@/schemas/dependents.schema"

const DEPENDENTS_LABEL = {
  "0": "0",
  "1": "1",
  "2": "2",
  "3+": "3 et +",
} satisfies Record<Dependents, string>

export function getDependentsLabel(dependents: Dependents) {
  return DEPENDENTS_LABEL[dependents]
}
