"use client"

import { JobData } from "@/api/airtable"
import { Dependents } from "@/schemas/dependents.schema"

import { getDependentsLabel } from "@/lib/get-dependents-label"
import { Button } from "@/components/ui/button"

import BackButton from "../components/selection-back-button"

interface SelectDependentsProps {
  jobData: JobData
  onSelect: (dependents: Dependents) => void
  onPrev: () => void
  careerStart: Date | null
}

export default function SelectDependents(props: SelectDependentsProps) {
  return (
    <div>
      <BackButton onPrev={props.onPrev} />

      <h2 className="mb-2 font-serif text-2xl">
        Sélectionne ton nombre de personnes à charge
      </h2>

      <p className="text-muted-foreground mb-8">
        Bonus de 2 500 € annuel / personne à charge
      </p>

      <div className="space-x-4">
        {(["0", "1", "2", "3+"] as const).map((dependents) => (
          <Button
            onClick={() => props.onSelect(dependents)}
            variant="secondary"
            size="lg"
            key={dependents}
          >
            {getDependentsLabel(dependents)}
          </Button>
        ))}
      </div>
    </div>
  )
}
