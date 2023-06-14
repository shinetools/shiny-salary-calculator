import { getJobData } from "@/api/airtable"
import { jobIdSchema } from "@/schemas/job-id.schema"
import { levelIdSchema } from "@/schemas/level-id.schema"
import { z } from "zod"

import IndexPageClient from "./page.client"

const paramsSchema = z.object({
  jobId: jobIdSchema.optional(),
  levelId: levelIdSchema.optional(),
})

export type ParamsSchema = z.infer<typeof paramsSchema>
export type Lang = "fr" | "en"

interface IndexPageProps {
  params: { lang: Lang }
}

export default async function IndexPage(props: IndexPageProps) {
  const data = await getJobData()

  return (
    <section className="mx-auto max-w-5xl p-4">
      <IndexPageClient jobData={data} lang={props.params.lang} />
    </section>
  )
}

export const dynamic = "error"
