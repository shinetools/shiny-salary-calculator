import { useCallback } from "react"
import Image from "next/image"
import { dependentsSchema } from "@/schemas/dependents.schema"
import { jobIdSchema } from "@/schemas/job-id.schema"
import { levelIdSchema } from "@/schemas/level-id.schema"
import { workLocationSchema } from "@/schemas/work-location.schema"
import CountUp from "react-countup"
import { z } from "zod"

import { JobDB } from "@/lib/job-db"
import { usePrevious } from "@/lib/use-previous"

import { SelectionSchema } from "../page.client"
import SimulationResult from "./simulation-result"

export const validSelectionSchema = z.object({
  jobId: jobIdSchema,
  levelId: levelIdSchema,
  careerStart: z.date().or(z.literal(false)),
  dependents: dependentsSchema,
  workLocation: workLocationSchema,
})

export type ValidSelectionSchema = z.infer<typeof validSelectionSchema>

interface SimulationPanelProps {
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

export default function SimulationPanel(props: SimulationPanelProps) {
  const completeSelectionParsing = validSelectionSchema.safeParse(
    props.selection
  )

  if (completeSelectionParsing.success) {
    const simulation = props.jobDB.computeSimulationData(
      completeSelectionParsing.data
    )

    return <SimulationResult jobDB={props.jobDB} simulation={simulation} />
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
