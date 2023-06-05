"use client"

import { JobData } from "@/api/airtable"
import { JobId } from "@/schemas/job-id.schema"
import { LevelId } from "@/schemas/level-id.schema"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

interface SelectLevelProps {
  jobData: JobData
  jobId: JobId
  onSelect: (levelId: LevelId) => void
  onPrev: () => void
}

export default function SelectLevel(props: SelectLevelProps) {
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

      <h2 className="font-serif text-2xl">Sélectionne ton niveau</h2>

      <div className="flex flex-wrap space-x-2 space-y-2">
        {props.jobData.levels
          .filter((level) => level.jobId === props.jobId)
          .map((level) => {
            console.log(`[LOG] →   level:`, level)
            return (
              <Button
                key={level.id}
                onClick={() => props.onSelect(level.id)}
                variant="secondary"
                className="first-of-type:ml-2 first-of-type:mt-2"
              >
                {`${level.level} - ${level.label}`}
              </Button>
            )
          })}
      </div>
    </div>
  )
}
