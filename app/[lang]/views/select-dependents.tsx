import { Dependents } from "@/schemas/dependents.schema"
import { motion } from "framer-motion"

import { getDependentsLabel } from "@/lib/get-dependents-label"
import { JobDB } from "@/lib/job-db"
import { motionVariants } from "@/lib/motion-variants"
import { MotionButton } from "@/components/ui/button"

import BackButton from "../components/selection-back-button"

interface SelectDependentsProps {
  jobDB: JobDB
  onSelect: (dependents: Dependents) => void
  onPrev: () => void
}

export default function SelectDependents(props: SelectDependentsProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={motionVariants.mainContainer}
    >
      <BackButton onPrev={props.onPrev} jobDB={props.jobDB} />

      <h2 className="mb-2 font-serif text-2xl">
        {props.jobDB.getLocale("selection-dependents-title")}
      </h2>

      <p className="text-muted-foreground mb-6">
        {props.jobDB.getLocale("selection-dependents-description")}
      </p>

      <motion.div
        className="-ml-3 flex flex-wrap space-x-4 space-y-3"
        variants={motionVariants.listItemsContainer}
      >
        {[0, 1, 2, 3].map((dependents) => (
          <MotionButton
            variants={motionVariants.itemContainerWithFade}
            onClick={() => props.onSelect(dependents)}
            variant="secondary"
            className="text-md first-of-type:ml-3 first-of-type:mt-3 last-of-type:px-6"
            size="lg"
            key={dependents}
          >
            {getDependentsLabel(dependents, props.jobDB.lang)}
          </MotionButton>
        ))}
      </motion.div>
    </motion.div>
  )
}
