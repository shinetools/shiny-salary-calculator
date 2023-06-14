"use client"

import { JobId } from "@/schemas/job-id.schema"
import { LevelId } from "@/schemas/level-id.schema"
import { motion } from "framer-motion"

import { JobDB } from "@/lib/job-db"
import { motionVariants } from "@/lib/motion-variants"
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={motionVariants.mainContainer}
      className="flex flex-col space-y-2"
    >
      <BackButton onPrev={props.onPrev} />

      <h2 className="font-serif text-2xl">Sélectionne ton niveau</h2>

      <motion.div
        className="-ml-3 flex flex-wrap space-x-3 space-y-3"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.035,
            },
          },
        }}
      >
        {props.jobDB.getLevelsForJob(props.jobId).map((level) => (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 5 },
              visible: { opacity: 1, y: 0 },
            }}
            className="first-of-type:ml-3 first-of-type:mt-3"
            key={level.id}
          >
            <Button
              onClick={() => props.onSelect(level.id)}
              variant="secondary"
            >
              {`${level.level} - ${level.label}`}
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
