"use client"

import { JobData } from "@/api/airtable"
import { JobId } from "@/schemas/job-id.schema"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

interface SelectJobProps {
  jobData: JobData
  onSelect: (jobId: JobId) => void
  onPrev: () => void
}

export default function SelectJob(props: SelectJobProps) {
  return (
    <div className="flex flex-col space-y-2">
      <Button
        variant="ghost"
        className="text-grey-600 flex items-center space-x-2 self-start"
        onClick={props.onPrev}
      >
        <ArrowLeft size="1em" />
        <span>Retour</span>
      </Button>

      <h2 className="font-serif text-2xl">Sélectionne ton équipe</h2>

      <div className="flex flex-wrap space-x-2 space-y-2">
        {props.jobData.jobs.map((job) => (
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
