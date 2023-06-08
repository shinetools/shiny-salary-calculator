"use client"

import { JobId } from "@/schemas/job-id.schema"

import { JobDB } from "@/lib/get-job-db"
import { Button } from "@/components/ui/button"

import BackButton from "../components/selection-back-button"

interface SelectJobProps {
  jobDB: JobDB
  onSelect: (jobId: JobId) => void
  onPrev: () => void
}

export default function SelectJob(props: SelectJobProps) {
  return (
    <div className="flex flex-col space-y-2">
      <BackButton onPrev={props.onPrev} />

      <h2 className="font-serif text-2xl">Sélectionne ton équipe</h2>

      <div className="flex flex-wrap space-x-2 space-y-2">
        {props.jobDB.jobs.map((job) => (
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
  )
}
