import Image from "next/image"
import { dependentsSchema } from "@/schemas/dependents.schema"
import { jobIdSchema } from "@/schemas/job-id.schema"
import { levelIdSchema } from "@/schemas/level-id.schema"
import { workLocationSchema } from "@/schemas/work-location.schema"
import { z } from "zod"

import { JobDB } from "@/lib/get-job-db"

import { SelectionSchema } from "../page.client"

/**
 * Currency formatter
 */
const currencyFormatter = new Intl.NumberFormat("fr", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
})

const validSelectionSchema = z.object({
  jobId: jobIdSchema,
  levelId: levelIdSchema,
  careerStart: z.date().or(z.literal(false)),
  dependents: dependentsSchema,
  workLocation: workLocationSchema,
})

export type ValidSelectionSchema = z.infer<typeof validSelectionSchema>

interface SimulationDisplayProps {
  selection: SelectionSchema
  jobDB: JobDB
}

type FinancialPerk = "holidaysBonus" | "profitSharing" | "shadowShares"

const FINANCIAL_PERKS = [
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
    id: FinancialPerk
  }[]
>

export default function SimulationDisplay(props: SimulationDisplayProps) {
  const completeSelectionParsing = validSelectionSchema.safeParse(
    props.selection
  )

  if (completeSelectionParsing.success) {
    const simulation = props.jobDB.computeSimulationData(
      completeSelectionParsing.data
    )

    return (
      <div className="relative h-[395px] rounded-lg bg-blue-800 p-6 text-white ">
        <Image
          src="/flower.png"
          width={120}
          height={120}
          alt=""
          className="absolute right-2 top-2"
        />

        <h2 className="font-medium">Salaire annuel brut</h2>

        <div className="mb-8 font-serif text-4xl">
          {currencyFormatter.format(simulation.salary)}
        </div>

        <h2 className="mb-3 text-lg font-medium">Avantages additionnels :</h2>

        <div className="space-y-4">
          {FINANCIAL_PERKS.map((perk) => {
            return (
              <div key={perk.id} className="grid grid-cols-[1fr_auto]">
                <div>
                  <h3 className="font-medium">{perk.title}</h3>
                  <div className="text-xs text-blue-100">
                    {perk.description}
                  </div>
                </div>

                <div className="text-end font-medium">
                  {currencyFormatter.format(simulation[perk.id])}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[395px] rounded-lg bg-blue-800 p-6 text-white ">
      <Image
        src="/flower.png"
        width={120}
        height={120}
        alt=""
        className="absolute right-2 top-2"
      />

      <div className="font-medium">Salaire annuel brut</div>
    </div>
  )
}
