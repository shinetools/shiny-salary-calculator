export const FINANCIAL_PERKS = [
  {
    id: "holidaysBonus",
    title: "Prime vacances (1 %)",
    description: "Versée tous les ans en juin.",
  },
  {
    id: "profitSharing",
    title: "Intéressement (7.5 %)",
    description: "Versée tous les ans, sous réserve de résultat.",
  },
  {
    id: "shadowShares",
    title: "Shadow shares (12.5 %)",
    description:
      "Versée tous les ans, après 2 ans d’ancienneté, sous réserve de résultat.",
  },
] satisfies Readonly<
  {
    title: string
    description: string
    id: string
  }[]
>

// export function getFinancialPerks() {
//   return FINANCIAL_PERKS[]
// }
