import type { JobData } from "@/api/airtable"
import {
  dependentsDataSchema,
  jobCategoriesDataSchema,
  jobsDataSchema,
  levelsDataSchema,
  localesDataSchema,
  perksDataSchema,
  seniorityDataSchema,
  workLocationDataSchema,
} from "@/api/airtable-schemas"
import { Dependents } from "@/schemas/dependents.schema"
import { JobId } from "@/schemas/job-id.schema"
import { LevelId } from "@/schemas/level-id.schema"
import { WorkLocation } from "@/schemas/work-location.schema"
import { z } from "zod"

import { ValidSelectionSchema } from "@/app/[lang]/components/simulation-panel"
import { Lang } from "@/app/[lang]/page"

import { computeSeniority } from "./compute-seniority"

export class JobDB {
  constructor(
    public readonly lang: Lang,
    public jobs: z.infer<typeof jobsDataSchema>,
    public levels: z.infer<typeof levelsDataSchema>,
    public jobCategories: z.infer<typeof jobCategoriesDataSchema>,
    public seniorityBonusData: z.infer<typeof seniorityDataSchema>,
    public workLocationBonusData: z.infer<typeof workLocationDataSchema>,
    public dependentsBonusData: z.infer<typeof dependentsDataSchema>,
    public perksData: z.infer<typeof perksDataSchema>,
    public localesData: z.infer<typeof localesDataSchema>
  ) {}

  getJob(jobId: JobId) {
    return this.jobs.find((job) => job.id === jobId)!
  }

  get getJobsByCategory() {
    return this.jobCategories.map((category) => {
      return {
        category,
        jobs: category.jobs.map(
          (jobId) => this.jobs.find((job) => job.id === jobId)!
        ),
      }
    })
  }

  getLocale(localeId: string) {
    const locale = this.localesData.find((locale) => {
      return locale.id === localeId
    })

    if (!locale) {
      console.error(`Locale ${localeId} not found`)
      return ""
    }

    return this.lang === "en" ? locale.en?.trim() || locale.fr : locale.fr
  }

  getLevel(levelId: LevelId) {
    return this.levels.find((level) => level.id === levelId)!
  }

  getBaseSalary(levelId: LevelId) {
    return this.getLevel(levelId).baseSalary
  }

  getLevelsForJob(jobId: JobId) {
    return this.levels.filter((level) => level.jobId === jobId)
  }

  getWorkLocationBonus(workLocation: WorkLocation) {
    return this.workLocationBonusData[workLocation] ?? 0
  }

  getDependentsBonus(dependents: Dependents) {
    return this.dependentsBonusData[dependents].bonus ?? 0
  }

  getSeniorityMultiplier = (careerStart: Date | false) => {
    if (careerStart === false) {
      return 0
    }

    return this.seniorityBonusData.find(
      ({ seniority }) => computeSeniority(careerStart) >= seniority
    )!.bonus
  }

  computeSimulationData(selection: ValidSelectionSchema) {
    const baseSalary = this.getBaseSalary(selection.levelId)
    const seniorityMultiplier = this.getSeniorityMultiplier(
      selection.careerStart
    )

    const salary =
      baseSalary +
      baseSalary * seniorityMultiplier +
      this.getDependentsBonus(selection.dependents) +
      this.getWorkLocationBonus(selection.workLocation)

    return {
      salary,
      holidaysBonus: Math.floor(salary * 0.01),
      profitSharing: Math.floor(salary * 0.075),
      shadowShares: Math.floor(salary * 0.125),
    }
  }
}

export const getJobDB = (
  {
    jobsData,
    levelsData,
    jobCategoriesData,
    seniorityBonusData,
    workLocationBonusData,
    dependentsBonusData,
    perksData,
    localesData,
  }: JobData,
  lang: Lang
) => {
  return new JobDB(
    lang,
    jobsData,
    levelsData,
    jobCategoriesData,
    seniorityBonusData,
    workLocationBonusData,
    dependentsBonusData,
    perksData,
    localesData
  )
}
