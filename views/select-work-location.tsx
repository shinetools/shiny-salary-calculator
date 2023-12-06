import Image from "next/image"
import { WorkLocation } from "@/schemas/work-location.schema"
import { motion } from "framer-motion"

import { getWorkLocationData } from "@/lib/get-work-location-data"
import { JobDB } from "@/lib/job-db"
import { motionVariants } from "@/lib/motion-variants"
import { cn } from "@/lib/utils"
import { MotionButton } from "@/components/ui/button"

import BackButton from "../components/selection-back-button"

interface SelectWorkLocationProps {
  jobDB: JobDB
  onSelect: (workLocation: WorkLocation) => void
  onPrev: () => void
  workLocation: WorkLocation | null
}

export default function SelectWorkLocation(props: SelectWorkLocationProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={motionVariants.mainContainer}
    >
      <BackButton onPrev={props.onPrev} jobDB={props.jobDB} />

      <h2 className="mb-8 font-serif text-2xl">
        {props.jobDB.getLocale("selection-workLocation-title")}
      </h2>

      <motion.div
        className={cn("grid grid-cols-1 gap-4 md:grid-cols-2")}
        variants={motionVariants.listItemsContainer}
      >
        {(["in-person", "full-remote-france"] as const).map(
          (workLocation, index) => (
            <MotionButton
              variants={motionVariants.bigItemContainerWithFade}
              onClick={() => props.onSelect(workLocation)}
              variant="secondary"
              size="lg"
              key={workLocation}
              className={cn("h-auto p-3 text-left", "md:col-span-2")}
            >
              <div>
                <div className="mb-2 flex items-center space-x-2">
                  <Image
                    src={getWorkLocationData(workLocation, props.jobDB).icon}
                    height={24}
                    width={24}
                    alt=""
                  />
                  <span>
                    {getWorkLocationData(workLocation, props.jobDB).title}
                  </span>
                </div>

                <div className="text-grey-700 text-sm font-normal">
                  {getWorkLocationData(workLocation, props.jobDB).description}
                </div>
              </div>
            </MotionButton>
          )
        )}
      </motion.div>
    </motion.div>
  )
}
