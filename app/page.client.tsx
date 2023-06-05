"use client"

import { useState } from "react"
import Image from "next/image"
import { JobData } from "@/api/airtable"
import { jobIdSchema } from "@/schemas/job-id.schema"
import { levelIdSchema } from "@/schemas/level-id.schema"
import { z } from "zod"

import { Loader } from "@/components/ui/loader"

import SelectJob from "./components/select-job"
import SelectLevel from "./components/select-level"
import SelectSeniority from "./components/select-seniority"
import SelectionHub from "./components/selection-hub"
import { ParamsSchema } from "./page"

const selectionSchema = z.object({
  jobId: jobIdSchema.optional(),
  levelId: levelIdSchema.optional(),
  careerStart: z.date().nullable(),
})

export type SelectionSchema = z.infer<typeof selectionSchema>

interface IndexPageClientProps {
  params: ParamsSchema
  jobData: JobData
}

export type Edition = "job" | "level" | "seniority"

export default function IndexPageClient(props: IndexPageClientProps) {
  const [editing, setEditing] = useState<Edition | null>(null)

  const [selection, setSelection] = useState<SelectionSchema>({
    jobId: props.params.jobId,
    levelId: props.params.levelId,
    careerStart: null,
  })

  return (
    <section className="bg-grey-100 rounded-2xl p-5">
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

              default:
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

        <div className="relative h-[395px] rounded-lg bg-blue-800 p-6 text-white ">
          <div className="font-medium">Salaire annuel brut</div>

          <Image
            src="/flower.png"
            width={120}
            height={120}
            alt=""
            className="absolute right-2 top-2"
          />
        </div>
      </div>
    </section>
  )
}
