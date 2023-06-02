"use client"

import { JobData } from "@/api/airtable"

import { computeSeniority } from "@/lib/compute-seniority"
import { getJob } from "@/lib/get-job"
import { getLevel } from "@/lib/get-level"
import SelectionItem from "@/components/selection-item"

import { Edition, SelectionSchema } from "../page.client"

interface SelectionHubProps {
  selection: SelectionSchema
  jobData: JobData
  onEdit: (edition: Edition) => void
}

export default function SelectionHub({
  onEdit,
  selection,
  jobData,
}: SelectionHubProps) {
  return (
    <div>
      <h2 className="font-serif text-2xl">Estime ton futur salaire</h2>

      <div className="flex flex-col space-y-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          <SelectionItem
            onClick={() => onEdit("job")}
            label="Ton métier"
            value={
              selection.jobId ? getJob(jobData, selection.jobId).label : null
            }
          />
          <SelectionItem
            onClick={() => {
              onEdit("level")
            }}
            label="Niveau du poste"
            value={
              selection.levelId
                ? getLevel(jobData, selection.levelId).level ?? ""
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
            value={(() => {
              if (!selection.careerStart) {
                return null
              }

              const seniority = computeSeniority(selection.careerStart)

              return `${seniority} an${seniority > 1 ? "s" : ""}`
            })()}
          />

          <SelectionItem
            onClick={() => {}}
            label="Tes personnes à charge"
            value="Test"
          />
        </div>

        <div className="grid gap-4">
          <SelectionItem
            onClick={() => {}}
            label="Ton lieu de travail"
            value={null}
          />
        </div>
      </div>
    </div>
  )
}
