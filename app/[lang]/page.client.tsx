"use client"

import { useState } from "react"
import Image from "next/image"
import { JobData } from "@/api/airtable"
import { careerStartSchema } from "@/schemas/career-start.schema"
import { dependentsSchema } from "@/schemas/dependents.schema"
import { JobId, jobIdSchema } from "@/schemas/job-id.schema"
import { levelIdSchema } from "@/schemas/level-id.schema"
import { workLocationSchema } from "@/schemas/work-location.schema"
import va, { Analytics } from "@vercel/analytics/react"
import ReactMarkdown from "react-markdown"
import { z } from "zod"

import { getJobDB } from "@/lib/job-db"
import { translate } from "@/lib/translate"
import { useHandleSearchParams } from "@/lib/use-handle-search-params"
import { cn } from "@/lib/utils"

import SimulationDisplay, {
  validSelectionSchema,
} from "./components/simulation-panel"
import { Lang } from "./page"
import SelectDependents from "./views/select-dependents"
import SelectJob from "./views/select-job"
import SelectLevel from "./views/select-level"
import SelectSeniority from "./views/select-seniority"
import SelectWorkLocation from "./views/select-work-location"
import SelectionHub from "./views/selection-hub"

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

const selectionSchema = z.object({
  jobId: jobIdSchema.nullable().catch(null),
  levelId: levelIdSchema.nullable().catch(null),
  careerStart: careerStartSchema.nullable().catch(null),
  dependents: dependentsSchema.nullable().catch(null),
  workLocation: workLocationSchema.nullable().catch(null),
})

export type SelectionSchema = z.infer<typeof selectionSchema>

export default function IndexPageClient(props: IndexPageClientProps) {
  const jobDB = getJobDB(props.jobData, props.lang)

  const [simulationDoneAs, setSimulationDoneAs] = useState<JobId | null>(null)
  const [editing, setEditing] = useState<Edition | null>(null)

  const searchParams = useHandleSearchParams()

  const inIframe = !!searchParams.get("iframe")

  const selection = selectionSchema.parse({
    // We store the job by its code in the URL for a human-readable URL param on TeamTailor
    jobId: jobDB.getJobByCode(searchParams.get("jobCode") as string | null)?.id,
    levelId: searchParams.get("levelId"),
    careerStart: searchParams.get("careerStart"),
    dependents: searchParams.get("dependents"),
    workLocation: searchParams.get("workLocation"),
  })

  const setSelection = ({ jobId, ...selection }: SelectionSchema) => {
    searchParams.set({
      ...selection,
      jobCode: jobId ? jobDB.getJob(jobId).job_code : null,
    })

    const simulation = validSelectionSchema.safeParse(selection)

    if (simulation.success === false) {
      // The simulation is not complete right now.
      return
    }

    const job = jobDB.getJob(simulation.data.jobId)?.job_code ?? ""

    if (simulationDoneAs === simulation.data.jobId) {
      return va.track("Simulation Updated", { job })
    }

    va.track("Simulation Performed", { job })
    setSimulationDoneAs(simulation.data.jobId)
  }

  return (
    <main
      className={cn("min-h-full", inIframe ? "bg-transparent" : "bg-grey-200")}
    >
      {/* Vercel Analytics will track page views and custom events (see `va.track` above) */}
      <Analytics />

      <div
        className={cn("mx-auto max-w-5xl p-2 md:p-4", inIframe && "p-0 md:p-0")}
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

        <div className="mt-12 overflow-x-scroll">
          <h1 className="mb-2 font-serif text-3xl">
            {jobDB.getLocale("main-perks-title")}
          </h1>

          <div className="overflow-x-scroll">
            <div className="-ml-4 flex min-w-[800px] flex-wrap space-x-4 space-y-4 pb-2 md:min-w-[auto]">
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
      </div>
    </main>
  )
}
