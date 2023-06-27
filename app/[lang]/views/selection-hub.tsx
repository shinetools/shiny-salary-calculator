import { motion } from "framer-motion"

import { computeSeniority } from "@/lib/compute-seniority"
import { getDependentsLabel } from "@/lib/get-dependents-label"
import { getWorkLocationData } from "@/lib/get-work-location-data"
import { JobDB } from "@/lib/job-db"
import { translate } from "@/lib/translate"
import SelectionItem from "@/components/selection-item"

import { Edition, SelectionSchema } from "../page.client"

interface SelectionHubProps {
  selection: SelectionSchema
  jobDB: JobDB
  onEdit: (edition: Edition) => void
}

export default function SelectionHub({
  onEdit,
  selection,
  jobDB,
}: SelectionHubProps) {
  return (
    <motion.div initial="hidden" animate="visible">
      <h2 className="mb-2 font-serif text-3xl">
        {jobDB.getLocale("main-title")}
      </h2>

      <motion.div className="flex flex-col space-y-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          <SelectionItem
            onClick={() => onEdit("job")}
            label={jobDB.getLocale("main-label-job")}
            currentSelection={
              selection.jobId
                ? translate(jobDB.lang, {
                    fr: jobDB.getJob(selection.jobId).fr_label,
                    en: jobDB.getJob(selection.jobId).en_label,
                  })
                : null
            }
          />
          <SelectionItem
            onClick={() => {
              if (selection.jobId === null) {
                return onEdit("job")
              }
              onEdit("level")
            }}
            label={jobDB.getLocale("main-label-level")}
            currentSelection={
              selection.levelId
                ? jobDB.getLevel(selection.levelId).level ?? ""
                : null
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectionItem
            onClick={() => {
              onEdit("seniority")
            }}
            label={jobDB.getLocale("main-label-seniority")}
            currentSelection={(() => {
              if (selection.careerStart === null) {
                return null
              }

              if (selection.careerStart === false) {
                return jobDB.lang === "fr" ? "0 année" : "0 year"
              }

              const seniority = computeSeniority(selection.careerStart)

              if (seniority === 0) {
                return jobDB.lang === "fr" ? "0 année" : "0 year"
              }

              return jobDB.lang === "fr"
                ? `${seniority} an${seniority > 1 ? "s" : ""}`
                : `${seniority} year${seniority > 1 ? "s" : ""}`
            })()}
          />

          <SelectionItem
            onClick={() => {
              onEdit("dependents")
            }}
            label={jobDB.getLocale("main-label-dependents")}
            currentSelection={
              selection.dependents === null
                ? null
                : getDependentsLabel(selection.dependents, jobDB.lang)
            }
          />
        </div>

        <div className="grid gap-4">
          <SelectionItem
            onClick={() => {
              onEdit("workLocation")
            }}
            label={jobDB.getLocale("main-label-workLocation")}
            currentSelection={
              selection.workLocation
                ? getWorkLocationData(selection.workLocation, jobDB).title
                : null
            }
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
