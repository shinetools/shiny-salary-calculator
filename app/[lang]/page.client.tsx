"use client"

import { useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
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
  const searchParams = useSearchParams()
  const inIframe = !!searchParams.get("iframe")

  const jobDB = getJobDB(props.jobData, props.lang)

  const [editing, setEditing] = useState<Edition | null>(null)

  const initialJob = jobDB.jobs.find(
    (job) => job.job_code === searchParams.get("job_code")
  )

  const [selection, setSelection] = useState<SelectionSchema>({
    jobId: initialJob?.id ?? null,
    levelId: null,
    careerStart: null,
    dependents: null,
    workLocation: null,
  })

  return (
    <main
      className={cn("min-h-full", inIframe ? "bg-transparent" : "bg-grey-200")}
    >
      <div
        className={cn(
          "mx-auto max-w-5xl p-2 md:p-4",
          inIframe && "py-0 md:py-0"
        )}
      >
        <section className="bg-grey-100 mb-4 rounded-2xl p-3">
          <div
            className={cn(
              "grid gap-3",
              "grid-cols-1 grid-rows-[320px_400px]",
              "md:grid-cols-[1fr_385px] md:grid-rows-[400px]"
            )}
          >
            <div
              className={cn(
                "relative overflow-y-scroll p-0 md:p-5",
                editing && "row-span-2 md:row-span-1"
              )}
            >
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
                        jobDB={jobDB}
                        onEdit={(edition) => setEditing(edition)}
                      />
                    )
                }
              })()}
            </div>

            <SimulationDisplay
              className={cn(editing && "hidden md:block")}
              jobDB={jobDB}
              selection={selection}
            />
          </div>
        </section>

        <div className="text-grey-700 px-2 text-sm">
          <ReactMarkdown
            components={{
              a: (props) => (
                <a
                  className="inline text-blue-600 transition-all hover:text-blue-700"
                  target="_blank"
                  {...props}
                />
              ),
            }}
          >
            {jobDB.getLocale("main-secondary-information")}
          </ReactMarkdown>
        </div>

        <div className="mt-12">
          <h1 className="mb-2 font-serif text-3xl">
            {jobDB.getLocale("main-perks-title")}
          </h1>

          <div className="-ml-4 flex flex-wrap space-x-4 space-y-4">
            {jobDB.perksData.map((perk) => (
              <div
                key={perk.fr_title}
                className={cn(
                  "bg-grey-100 flex h-[62px] items-center space-x-3 rounded-xl p-2 pr-3",
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
    </main>
  )
}
