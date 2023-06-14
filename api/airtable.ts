import Airtable, { FieldSet, Records } from "airtable"

import ENV from "@/lib/env"

import {
  dependentsDataSchema,
  jobCategoriesDataSchema,
  jobsDataSchema,
  levelsDataSchema,
  localesDataSchema,
  perksDataSchema,
  seniorityDataSchema,
  workLocationDataSchema,
} from "./airtable-schemas"

Airtable.configure({ apiKey: ENV.AIRTABLE_API_KEY })

const base = Airtable.base(ENV.AIRTABLE_BASE_ID)

const formatRecords = (records: Records<FieldSet>) =>
  records.map(({ id, fields }) => ({ ...fields, id: fields.id ?? id }))

export const getJobData = async () => {
  const [
    jobsData,
    levelsData,
    categoriesData,
    seniorityBonusData,
    workLocationBonusData,
    dependentsBonusData,
    perksData,
    localesData,
  ] = await Promise.all([
    base
      .table("jobs")
      .select({ view: "main" })
      .all()
      .then((records) => jobsDataSchema.parse(formatRecords(records))),

    base
      .table("levels")
      .select({ view: "main" })
      .all()
      .then((records) => levelsDataSchema.parse(formatRecords(records))),

    base
      .table("categories")
      .select({ view: "main" })
      .all()
      .then((records) => jobCategoriesDataSchema.parse(formatRecords(records))),

    base
      .table("seniority_bonus")
      .select({ view: "main" })
      .all()
      .then((records) =>
        seniorityDataSchema
          .parse(formatRecords(records))
          .sort((a, b) => (a.seniority < b.seniority ? 1 : -1))
      ),

    base
      .table("location_bonus")
      .select({ view: "main" })
      .all()
      .then((records) => workLocationDataSchema.parse(formatRecords(records))),

    base
      .table("dependents_bonus")
      .select({ view: "main" })
      .all()
      .then((records) => dependentsDataSchema.parse(formatRecords(records))),

    base
      .table("perks")
      .select({ view: "main" })
      .all()
      .then((records) => perksDataSchema.parse(formatRecords(records))),

    base
      .table("locales")
      .select({ view: "main" })
      .all()
      .then((records) => {
        return localesDataSchema.parse(formatRecords(records))
      }),
  ])

  return {
    jobsData,
    levelsData,
    jobCategoriesData: categoriesData,
    seniorityBonusData,
    workLocationBonusData,
    dependentsBonusData,
    perksData,
    localesData,
  }
}

export type JobData = Awaited<ReturnType<typeof getJobData>>
