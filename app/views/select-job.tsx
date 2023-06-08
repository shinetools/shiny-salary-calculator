"use client"

import { JobId } from "@/schemas/job-id.schema"

import { JobDB } from "@/lib/job-db"
import { Button } from "@/components/ui/button"

import BackButton from "../components/selection-back-button"

interface SelectJobProps {
  jobDB: JobDB
  onSelect: (jobId: JobId) => void
  onPrev: () => void
}

export default function SelectJob(props: SelectJobProps) {
  return (
    <div className="flex flex-col">
      <BackButton onPrev={props.onPrev} />

      <h2 className="mb-4 font-serif text-2xl">Sélectionne ton équipe</h2>

      <div className="-ml-2 space-y-4">
        {props.jobDB.jobsByCategory.map(({ category, jobs }) => (
          <div>
            <h3 className="ml-2 text-lg font-medium">{category.label}</h3>

            <div className="flex flex-wrap space-x-2 space-y-2">
              {jobs.map((job) => (
                <Button
                  key={job.id}
                  onClick={() => props.onSelect(job.id)}
                  variant="secondary"
                  className="first-of-type:ml-2 first-of-type:mt-2"
                >
                  {job.label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
