"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { JobData } from "@/api/airtable"
import { dependentsSchema } from "@/schemas/dependents.schema"
import { jobIdSchema } from "@/schemas/job-id.schema"
import { levelIdSchema } from "@/schemas/level-id.schema"
import { workLocationSchema } from "@/schemas/work-location.schema"
import ReactMarkdown from "react-markdown"
import { z } from "zod"

import { getJobDB } from "@/lib/job-db"
import { translate } from "@/lib/translate"
import { cn } from "@/lib/utils"

import SimulationDisplay from "./components/simulation-panel"
import { Lang, ParamsSchema } from "./page"
import SelectDependents from "./views/select-dependents"
import SelectJob from "./views/select-job"
import SelectLevel from "./views/select-level"
import SelectSeniority from "./views/select-seniority"
import SelectWorkLocation from "./views/select-work-location"
import SelectionHub from "./views/selection-hub"

const selectionSchema = z.object({
  jobId: jobIdSchema.nullable(),
  levelId: levelIdSchema.nullable(),
  dependents: dependentsSchema.nullable(),
  workLocation: workLocationSchema.nullable(),
  careerStart: z
    .date()
    // `undefined` is for unprovided value
    .nullable()
    // `false` is for a candidate that has zero XP
    .or(z.literal(false)),
})

export type SelectionSchema = z.infer<typeof selectionSchema>

interface IndexPageClientProps {
  params: ParamsSchema
  jobData: JobData
  lang: Lang
}

export type Edition =
  | "job"
  | "level"
  | "seniority"
  | "dependents"
  | "workLocation"

export default function IndexPageClient(props: IndexPageClientProps) {
  const jobDB = getJobDB(props.jobData, props.lang)

  const [editing, setEditing] = useState<Edition | null>(null)

  const [selection, setSelection] = useState<SelectionSchema>({
    jobId: props.params.jobId ?? null,
    levelId: props.params.levelId ?? null,
    careerStart: null,
    dependents: null,
    workLocation: null,
  })

  return (
    <div>
      <section className="bg-grey-100 mb-4 rounded-2xl p-3">
        <div className="grid grid-cols-[1fr_385px] grid-rows-[400px] gap-3">
          <div className="relative overflow-y-scroll p-5">
            {(() => {
              switch (editing) {
                case "job":
                  return (
                    <SelectJob
                      onSelect={(jobId) => {
                        setSelection({ ...selection, jobId, levelId: null })

                        if (selection.levelId === null) {
                          return setEditing("level")
                        }

                        return setEditing(null)
                      }}
                      onPrev={() => setEditing(null)}
                      jobDB={jobDB}
                    />
                  )

                case "level":
                  return (
                    <SelectLevel
                      onSelect={(levelId) => {
                        setSelection({ ...selection, levelId })

                        if (selection.careerStart === null) {
                          return setEditing("seniority")
                        }

                        return setEditing(null)
                      }}
                      onPrev={() => setEditing(null)}
                      jobDB={jobDB}
                      jobId={selection.jobId!}
                    />
                  )

                case "seniority":
                  return (
                    <SelectSeniority
                      onSelect={(seniority) => {
                        setSelection({ ...selection, careerStart: seniority })

                        if (selection.dependents === null) {
                          return setEditing("dependents")
                        }

                        return setEditing(null)
                      }}
                      onPrev={() => setEditing(null)}
                      jobDB={jobDB}
                      careerStart={selection.careerStart}
                    />
                  )

                case "dependents":
                  return (
                    <SelectDependents
                      onSelect={(dependents) => {
                        setSelection({ ...selection, dependents })

                        if (selection.workLocation === null) {
                          return setEditing("workLocation")
                        }

                        return setEditing(null)
                      }}
                      onPrev={() => setEditing(null)}
                      jobDB={jobDB}
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
                      jobDB={jobDB}
                      workLocation={selection.workLocation}
                    />
                  )

                case null:
                  return (
                    <SelectionHub
                      selection={selection}
                      jobData={jobDB}
                      onEdit={(edition) => setEditing(edition)}
                    />
                  )
              }
            })()}
          </div>

          <SimulationDisplay jobDB={jobDB} selection={selection} />
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

      <div className="mt-12">
        <h1 className="mb-4 font-serif text-3xl">
          {"Plein d'autres avantages"}
        </h1>

        <div className="-ml-4 flex flex-wrap space-x-4 space-y-4">
          {jobDB.perksData.map((perk) => (
            <div
              key={perk.fr_title}
              className={cn(
                "bg-grey-100 flex h-[62px] items-center space-x-3 rounded-lg p-2 pr-3",
                "first-of-type:ml-4 first-of-type:mt-4"
              )}
            >
              <div
                className={cn(
                  "bg-grey-200 flex h-[46px] w-[46px] items-center justify-center rounded-lg"
                )}
              >
                <Image width={24} height={24} src={perk.icon.url} alt="" />
              </div>

              <ReactMarkdown
                className={cn(
                  "prose prose-strong:font-medium prose-strong:text-primary prose-p:text-grey-700 prose-p:leading-4 prose-strong:text-sm prose-p:text-xs",
                  "whitespace-pre-line"
                )}
              >
                {translate(props.lang, {
                  fr: perk.fr_title,
                  en: perk.en_title,
                })}
              </ReactMarkdown>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
