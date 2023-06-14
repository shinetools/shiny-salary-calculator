"use client"

import { motion } from "framer-motion"

import { computeSeniority } from "@/lib/compute-seniority"
import { getDependentsLabel } from "@/lib/get-dependents-label"
import { getWorkLocationData } from "@/lib/get-work-location-data"
import { JobDB } from "@/lib/job-db"
import { motionVariants } from "@/lib/motion-variants"
import SelectionItem from "@/components/selection-item"

import { Edition, SelectionSchema } from "../page.client"

interface SelectionHubProps {
  selection: SelectionSchema
  jobData: JobDB
  onEdit: (edition: Edition) => void
}

export default function SelectionHub({
  onEdit,
  selection,
  jobData,
}: SelectionHubProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={motionVariants.mainContainer}
    >
      <h2 className="mb-2 font-serif text-3xl">
        {jobData.getLocale("main-title")}
      </h2>

      <motion.div
        variants={motionVariants.listItemsContainer}
        className="flex flex-col space-y-6 py-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <SelectionItem
            onClick={() => onEdit("job")}
            label={jobData.getLocale("main-label-job")}
            currentSelection={
              selection.jobId ? jobData.getJob(selection.jobId).label : null
            }
          />
          <SelectionItem
            onClick={() => {
              if (selection.jobId === null) {
                return onEdit("job")
              }
              onEdit("level")
            }}
            label={jobData.getLocale("main-label-level")}
            currentSelection={
              selection.levelId
                ? jobData.getLevel(selection.levelId).level ?? ""
                : null
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectionItem
            onClick={() => {
              onEdit("seniority")
            }}
            label={jobData.getLocale("main-label-seniority")}
            currentSelection={(() => {
              if (selection.careerStart === null) {
                return null
              }

              if (selection.careerStart === false) {
                return "/"
              }

              const seniority = computeSeniority(selection.careerStart)

              return jobData.lang === "fr"
                ? `${seniority} an${seniority > 1 ? "s" : ""}`
                : `${seniority} year${seniority > 1 ? "s" : ""}`
            })()}
          />

          <SelectionItem
            onClick={() => {
              onEdit("dependents")
            }}
            label={jobData.getLocale("main-label-dependents")}
            currentSelection={
              selection.dependents === null
                ? null
                : getDependentsLabel(selection.dependents)
            }
          />
        </div>

        <div className="grid gap-4">
          <SelectionItem
            onClick={() => {
              onEdit("workLocation")
            }}
            label={jobData.getLocale("main-label-workLocation")}
            currentSelection={
              selection.workLocation
                ? getWorkLocationData(selection.workLocation).title
                : null
            }
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
