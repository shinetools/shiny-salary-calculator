"use client"

import Image from "next/image"
import { JobData } from "@/api/airtable"
import { WorkLocation } from "@/schemas/work-location.schema"

import { getDependentsLabel } from "@/lib/get-dependents-label"
import { getWorkLocationData } from "@/lib/get-work-location-data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import BackButton from "../components/selection-back-button"

interface SelectWorkLocationProps {
  jobData: JobData
  onSelect: (workLocation: WorkLocation) => void
  onPrev: () => void
  workLocation: WorkLocation | null
}

export default function SelectWorkLocation(props: SelectWorkLocationProps) {
  return (
    <div>
      <BackButton onPrev={props.onPrev} />

      <h2 className="mb-2 font-serif text-2xl">
        Sélectionne ton nombre de personnes à charge
      </h2>

      <p className="text-muted-foreground mb-8">
        Bonus de 2 500 € annuel / personne à charge
      </p>

      <div className="grid grid-cols-2 gap-4">
        {(
          ["in-person", "full-remote-france", "full-remote-europe"] as const
        ).map((workLocation, index) => {
          return (
            <Button
              onClick={() => props.onSelect(workLocation)}
              variant="secondary"
              size="lg"
              key={workLocation}
              className={cn(
                "h-auto p-3 text-left",
                index === 0 && "col-span-2 "
              )}
            >
              <div>
                <div className="mb-2 flex items-center space-x-2">
                  <Image
                    src={getWorkLocationData(workLocation).icon}
                    height={24}
                    width={24}
                    alt=""
                  />
                  <span>{getWorkLocationData(workLocation).title}</span>
                </div>

                <div className="text-grey-600 text-sm font-normal">
                  {getWorkLocationData(workLocation).description}
                </div>
              </div>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
