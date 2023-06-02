import { jobSchema } from "@/schemas/job.schema"
import { levelSchema } from "@/schemas/level.schema"
import Airtable from "airtable"
import { AirtableBase } from "airtable/lib/airtable_base"
import { z } from "zod"

import ENV from "@/lib/env"

Airtable.configure({ apiKey: ENV.AIRTABLE_API_KEY })

const levelsSchema = z.array(levelSchema)
const jobsSchema = z.array(jobSchema)

class AirtableClient {
  base: AirtableBase

  constructor() {
    this.base = Airtable.base(ENV.AIRTABLE_BASE_ID)
  }

  async jobData() {
    const levelRecords = await this.base
      .table("levels")
      .select({ view: "main" })
      .all()
      .then((records) => records.map(({ fields, id }) => ({ id, ...fields })))

    const levels = levelsSchema.parse(levelRecords)

    const jobsRaw = await this.base.table("jobs").select({ view: "main" }).all()

    const jobs = jobsSchema.parse(
      jobsRaw.map(({ id, fields }) => ({ ...fields, id }))
    )

    return jobs.map((job) => ({
      ...job,
      levels: levels.filter((level) => level.jobId === job.id),
    }))
  }
}

export type JobData = Awaited<ReturnType<AirtableClient["jobData"]>>

const airtableClient = new AirtableClient()

export default airtableClient
