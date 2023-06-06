import { JobData } from "@/api/airtable"

import { ValidSelectionSchema } from "@/app/components/simulation-display"

import { getLevel } from "./get-level"

export function computeSimulationData({
  jobData,
  selection,
}: {
  jobData: JobData
  selection: ValidSelectionSchema
}) {
  const baseSalary = getLevel(jobData, selection.levelId).baseSalary

  return {
    baseSalary,
    holidaysBonus: Math.floor(baseSalary * 0.01),
    profitSharing: Math.floor(baseSalary * 0.075),
    shadowShares: Math.floor(baseSalary * 0.125),
  }
}
