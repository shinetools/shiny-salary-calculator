"use client"

import { computeSeniority } from "@/lib/compute-seniority"
import { getDependentsLabel } from "@/lib/get-dependents-label"
import { JobDB } from "@/lib/get-job-db"
import { getWorkLocationData } from "@/lib/get-work-location-data"
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
    <div>
      <h2 className="mb-6 font-serif text-2xl">Estime ton futur salaire</h2>

      <div className="flex flex-col space-y-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          <SelectionItem
            onClick={() => onEdit("job")}
            label="Ton métier"
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
            label="Niveau du poste"
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
            label="Ta séniorité"
            currentSelection={(() => {
              if (selection.careerStart === null) {
                return null
              }

              if (selection.careerStart === false) {
                return "/"
              }

              const seniority = computeSeniority(selection.careerStart)

              return `${seniority} an${seniority > 1 ? "s" : ""}`
            })()}
          />

          <SelectionItem
            onClick={() => {
              onEdit("dependents")
            }}
            label="Tes personnes à charge"
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
            label="Ton lieu de travail"
            currentSelection={
              selection.workLocation
                ? getWorkLocationData(selection.workLocation).title
                : null
            }
          />
        </div>
      </div>
    </div>
  )
}
