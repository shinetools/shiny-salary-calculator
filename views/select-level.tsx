import { JobId } from "@/schemas/job-id.schema"
import { LevelId } from "@/schemas/level-id.schema"
import { motion } from "framer-motion"

import { JobDB } from "@/lib/job-db"
import { motionVariants } from "@/lib/motion-variants"
import { translate } from "@/lib/translate"
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
      <BackButton onPrev={props.onPrev} jobDB={props.jobDB} />

      <h2 className="font-serif text-2xl">
        {props.jobDB.getLocale("selection-level-title")}
      </h2>

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
              className="block h-auto"
            >
              <span className="block">{level.level}</span>
              <span className="text-grey-700 block text-xs font-normal">
                {translate(props.jobDB.lang, {
                  fr: level.fr_label ?? "",
                  en: level.en_label,
                })}
              </span>
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
