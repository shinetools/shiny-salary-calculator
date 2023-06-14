import Image from "next/image"
import { dependentsSchema } from "@/schemas/dependents.schema"
import { jobIdSchema } from "@/schemas/job-id.schema"
import { levelIdSchema } from "@/schemas/level-id.schema"
import { workLocationSchema } from "@/schemas/work-location.schema"
import { z } from "zod"

import { JobDB } from "@/lib/job-db"

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
    <div className="relative h-full self-stretch rounded-xl bg-blue-800 p-6 text-white">
      <Image
        src="/assets/flower.png"
        width={120}
        height={120}
        alt=""
        className="absolute right-2 top-2"
      />

      <div className="font-medium">Salaire annuel brut</div>

      <div className="mb-8 font-serif text-4xl font-medium blur-md">
        {"42 726 €"}
      </div>

      <div className="absolute inset-x-10 top-[50%] text-center text-sm text-[#9BAEB2]">
        {
          "Complète les informations sur la gauche pour estimer ton futur salaire"
        }
      </div>
    </div>
  )
}
