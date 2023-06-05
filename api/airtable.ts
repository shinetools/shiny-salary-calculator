import { jobSchema } from "@/schemas/job.schema"
import { levelSchema } from "@/schemas/level.schema"
import Airtable from "airtable"
import { z } from "zod"

import ENV from "@/lib/env"

Airtable.configure({ apiKey: ENV.AIRTABLE_API_KEY })

const levelsSchema = z.array(levelSchema)
const jobsSchema = z.array(jobSchema)

const base = Airtable.base(ENV.AIRTABLE_BASE_ID)

export const getJobData = async () => {
  const [jobRecords, levelRecords] = await Promise.all([
    base
      .table("jobs")
      .select({ view: "main" })
      .all()
      .then((records) => records.map(({ id, fields }) => ({ ...fields, id }))),

    base
      .table("levels")
      .select({ view: "main" })
      .all()
      .then((records) =>
        records.map(({ fields, id, ...rest }) => ({ id, ...fields }))
      ),
  ])

  const levels = levelsSchema.parse(levelRecords)
  const jobs = jobsSchema.parse(jobRecords)

  return {
    levels,
    jobs: jobs.map((job) => ({
      ...job,
      levels: levels.filter((level) => level.jobId === job.id),
    })),
  }
}

export type JobData = Awaited<ReturnType<typeof getJobData>>
