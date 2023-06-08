"use client"

import { JobId } from "@/schemas/job-id.schema"
import { LevelId } from "@/schemas/level-id.schema"

import { JobDB } from "@/lib/job-db"
import { Button } from "@/components/ui/button"

import BackButton from "../components/selection-back-button"

interface SelectLevelProps {
  jobDB: JobDB
  jobId: JobId
  onSelect: (levelId: LevelId) => void
  onPrev: () => void
}

export default function SelectLevel(props: SelectLevelProps) {
  return (
    <div className="flex flex-col space-y-2">
      <BackButton onPrev={props.onPrev} />

      <h2 className="font-serif text-2xl">Sélectionne ton niveau</h2>

      <div className="flex flex-wrap space-x-2 space-y-2">
        {props.jobDB.getLevelsForJob(props.jobId).map((level) => (
          <Button
            key={level.id}
            onClick={() => props.onSelect(level.id)}
            variant="secondary"
            className="first-of-type:ml-2 first-of-type:mt-2"
          >
            {`${level.level} - ${level.label}`}
          </Button>
        ))}
      </div>
    </div>
  )
}
