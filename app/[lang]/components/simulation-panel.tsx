import Image from "next/image"
import { careerStartSchema } from "@/schemas/career-start.schema"
import { dependentsSchema } from "@/schemas/dependents.schema"
import { jobIdSchema } from "@/schemas/job-id.schema"
import { levelIdSchema } from "@/schemas/level-id.schema"
import { workLocationSchema } from "@/schemas/work-location.schema"
import { z } from "zod"

import { JobDB } from "@/lib/job-db"
import { cn } from "@/lib/utils"

import { SelectionSchema } from "../page.client"
import SimulationResult from "./simulation-result"

export const validSelectionSchema = z.object({
  jobId: jobIdSchema,
  levelId: levelIdSchema,
  careerStart: careerStartSchema,
  dependents: dependentsSchema,
  workLocation: workLocationSchema,
})

export type ValidSelectionSchema = z.infer<typeof validSelectionSchema>

interface SimulationPanelProps {
  selection: SelectionSchema
  jobDB: JobDB
  className?: string
}

export default function SimulationPanel({
  className,
  ...props
}: SimulationPanelProps) {
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
    <div
      className={cn(
        "relative h-full self-stretch rounded-xl bg-blue-800 p-6 text-white",
        className
      )}
    >
      <Image
        src="/assets/flower.png"
        width={120}
        height={120}
        alt=""
        className="absolute right-2 top-2"
      />

      <div className="font-medium">
        {props.jobDB.getLocale("simulation-title")}
      </div>

      <div className="mb-8 select-none font-serif text-4xl font-medium blur-md">
        {"42 726 €"}
      </div>

      <div className="absolute inset-x-10 top-[50%] text-center text-sm text-[#9BAEB2]">
        {props.jobDB.getLocale("simulation-emptyMessage")}
      </div>
    </div>
  )
}
