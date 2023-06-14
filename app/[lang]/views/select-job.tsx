"use client"

import { JobId } from "@/schemas/job-id.schema"
import { motion } from "framer-motion"

import { JobDB } from "@/lib/job-db"
import { motionVariants } from "@/lib/motion-variants"
import { Button } from "@/components/ui/button"

import BackButton from "../components/selection-back-button"

interface SelectJobProps {
  jobDB: JobDB
  onSelect: (jobId: JobId) => void
  onPrev: () => void
}

export default function SelectJob(props: SelectJobProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={motionVariants.mainContainer}
      className="flex flex-col"
    >
      <BackButton onPrev={props.onPrev} />

      <h2 className="mb-4 font-serif text-2xl">Sélectionne ton équipe</h2>

      <div className="-ml-3 space-y-6">
        {props.jobDB.getJobsByCategory.map(({ category, jobs }) => (
          <motion.div variants={motionVariants.listItemsContainer}>
            <h3 className="ml-3 text-lg font-medium">{category.label}</h3>

            <div className="flex flex-wrap space-x-3 space-y-3">
              {jobs.map((job) => (
                <motion.div
                  variants={motionVariants.itemContainerWithFade}
                  className="first-of-type:ml-3 first-of-type:mt-3"
                  key={job.id}
                >
                  <Button
                    onClick={() => props.onSelect(job.id)}
                    variant="secondary"
                  >
                    {job.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
