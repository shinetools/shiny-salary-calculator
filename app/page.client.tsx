"use client"

import { useState } from "react"
import Link from "next/link"
import { JobData } from "@/api/airtable"
import { dependentsSchema } from "@/schemas/dependents.schema"
import { jobIdSchema } from "@/schemas/job-id.schema"
import { levelIdSchema } from "@/schemas/level-id.schema"
import { workLocationSchema } from "@/schemas/work-location.schema"
import { z } from "zod"

import SimulationDisplay from "./components/simulation-display"
import { ParamsSchema } from "./page"
import SelectDependents from "./views/select-dependents"
import SelectJob from "./views/select-job"
import SelectLevel from "./views/select-level"
import SelectSeniority from "./views/select-seniority"
import SelectWorkLocation from "./views/select-work-location"
import SelectionHub from "./views/selection-hub"

const selectionSchema = z.object({
  jobId: jobIdSchema.optional(),
  levelId: levelIdSchema.optional(),
  careerStart: z.date().nullable(),
  dependents: dependentsSchema.nullable(),
  workLocation: workLocationSchema.nullable(),
})

export type SelectionSchema = z.infer<typeof selectionSchema>

interface IndexPageClientProps {
  params: ParamsSchema
  jobData: JobData
}

export type Edition =
  | "job"
  | "level"
  | "seniority"
  | "dependents"
  | "workLocation"

export default function IndexPageClient(props: IndexPageClientProps) {
  const [editing, setEditing] = useState<Edition | null>(null)

  const [selection, setSelection] = useState<SelectionSchema>({
    jobId: props.params.jobId,
    levelId: props.params.levelId,
    careerStart: null,
    dependents: null,
    workLocation: null,
  })

  return (
    <div>
      <section className="bg-grey-100 mb-4 rounded-2xl p-5">
        <div className="grid grid-cols-[1fr_385px] space-x-12">
          <div className="relative">
            {(() => {
              switch (editing) {
                case "job":
                  return (
                    <SelectJob
                      onSelect={(jobId) => {
                        setSelection({ ...selection, jobId })
                        setEditing(null)
                      }}
                      onPrev={() => setEditing(null)}
                      jobData={props.jobData}
                    />
                  )

                case "level":
                  return (
                    <SelectLevel
                      onSelect={(levelId) => {
                        setSelection({ ...selection, levelId })
                        setEditing(null)
                      }}
                      onPrev={() => setEditing(null)}
                      jobData={props.jobData}
                      jobId={selection.jobId!}
                    />
                  )

                case "seniority":
                  return (
                    <SelectSeniority
                      onSelect={(seniority) => {
                        setSelection({ ...selection, careerStart: seniority })
                        setEditing(null)
                      }}
                      onPrev={() => setEditing(null)}
                      jobData={props.jobData}
                      careerStart={selection.careerStart}
                    />
                  )

                case "dependents":
                  return (
                    <SelectDependents
                      onSelect={(dependents) => {
                        setSelection({ ...selection, dependents })
                        setEditing(null)
                      }}
                      onPrev={() => setEditing(null)}
                      jobData={props.jobData}
                      careerStart={selection.careerStart}
                    />
                  )

                case "workLocation":
                  return (
                    <SelectWorkLocation
                      onSelect={(workLocation) => {
                        setSelection({ ...selection, workLocation })
                        setEditing(null)
                      }}
                      onPrev={() => setEditing(null)}
                      jobData={props.jobData}
                      workLocation={selection.workLocation}
                    />
                  )

                case null:
                  return (
                    <SelectionHub
                      selection={selection}
                      jobData={props.jobData}
                      onEdit={(edition) => setEditing(edition)}
                    />
                  )
              }
            })()}
          </div>

          <SimulationDisplay jobData={props.jobData} selection={selection} />
        </div>
      </section>

      <div className="px-2">
        <span>{"En savoir plus sur notre politique de "}</span>
        <Link
          className="text-blue-600 transition-all hover:text-blue-700"
          href="https://www.shine.fr/blog/la-transparence-des-salaires-chez-shine"
          target="_blank"
        >
          {"transparence des salaires chez Shine"}
        </Link>
      </div>
    </div>
  )
}
