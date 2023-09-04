import { useState } from "react"
import type { GetStaticProps, InferGetStaticPropsType } from "next"
import Head from "next/head"
import Image from "next/image"
import { getJobData } from "@/api/airtable"
import { careerStartSchema } from "@/schemas/career-start.schema"
import { dependentsSchema } from "@/schemas/dependents.schema"
import { JobId, jobIdSchema } from "@/schemas/job-id.schema"
import { levelIdSchema } from "@/schemas/level-id.schema"
import { workLocationSchema } from "@/schemas/work-location.schema"
import SelectDependents from "@/views/select-dependents"
import SelectJob from "@/views/select-job"
import SelectLevel from "@/views/select-level"
import SelectSeniority from "@/views/select-seniority"
import SelectWorkLocation from "@/views/select-work-location"
import SelectionHub from "@/views/selection-hub"
import va, { Analytics } from "@vercel/analytics/react"
import ReactMarkdown from "react-markdown"
import { z } from "zod"

import { getJobDB } from "@/lib/job-db"
import { Lang } from "@/lib/locales"
import { translate } from "@/lib/translate"
import { useHandleSearchParams } from "@/lib/use-handle-search-params"
import { cn } from "@/lib/utils"
import SimulationPanel, {
  validSelectionSchema,
} from "@/components/simulation-panel"

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

export const getStaticProps = (async (props) => {
  const data = await getJobData()
  return {
    props: {
      data,
      lang: (props.locale ?? props.defaultLocale ?? "fr") as Lang,
    },
  }
}) satisfies GetStaticProps

export default function Page({
  data,
  lang,
}: InferGetStaticPropsType<typeof getStaticProps> & { className: string }) {
  const searchParams = useHandleSearchParams()
  const inIframe = !!searchParams.get("iframe")

  const jobDB = getJobDB(data, lang)

  const [simulationDoneAs, setSimulationDoneAs] = useState<JobId | null>(null)
  const [editing, setEditing] = useState<Edition | null>(null)

  const selection = selectionSchema.parse({
    jobId: jobDB.getJobByCode(searchParams.get("jobCode") as string | null)?.id,
    levelId: searchParams.get("levelId"),
    careerStart: searchParams.get("careerStart"),
    dependents: searchParams.get("dependents"),
    workLocation: searchParams.get("workLocation"),
  })

  const handleSetSelection = (update: Partial<SelectionSchema>) => {
    searchParams.set({
      ...update,
      ...(update.jobId !== undefined
        ? { jobCode: update.jobId ? jobDB.getJob(update.jobId).job_code : null }
        : undefined),
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
    <div
      className={cn("min-h-full", inIframe ? "bg-transparent" : "bg-grey-200")}
    >
      {/* Vercel Analytics will track page views and custom events (see `va.track` above) */}
      <Analytics />

      <Head>
        <title>
          {lang === "fr"
            ? "Shine | Estime ton salaire"
            : "Shine | Estimate your salary"}
        </title>
        <meta name="des" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content={
            lang === "fr"
              ? "Chez Shine, nous avons fait le choix de la transparence des salaires. Tu peux ici estimer le salaire que tu gagnerais en nous rejoignant !"
              : "At Shine, we've chosen salary transparency. Here, you can estimate the salary you would earn by joining us!"
          }
        />
      </Head>

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
                          handleSetSelection({
                            // ...selection,
                            jobId,
                            levelId: null,
                          })

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
                          handleSetSelection({ levelId })

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
                          handleSetSelection({
                            careerStart: seniority,
                          })

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
                          handleSetSelection({ ...selection, dependents })

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
                          handleSetSelection({ ...selection, workLocation })
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

            <SimulationPanel
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
                  {perk.icon_name && (
                    <div
                      className={cn(
                        "bg-grey-200 flex h-[46px] w-[46px] items-center justify-center rounded-lg"
                      )}
                    >
                      <Image
                        width={24}
                        height={24}
                        src={`/assets/perk-icons/${perk.icon_name}.svg`}
                        alt=""
                      />
                    </div>
                  )}

                  <ReactMarkdown
                    className={cn(
                      "prose prose-strong:font-medium prose-strong:text-primary prose-p:text-grey-700 prose-p:leading-4 prose-strong:text-sm prose-p:text-xs",
                      "whitespace-pre-line"
                    )}
                  >
                    {translate(lang, {
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
    </div>
  )
}
