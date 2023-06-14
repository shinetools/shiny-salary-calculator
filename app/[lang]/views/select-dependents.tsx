"use client"

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
        Indique le nombre de personnes à ta charge
      </h2>

      <p className="text-muted-foreground mb-8">
        Bonus de 2 500 € annuel par personne à charge
      </p>

      <motion.div
        className="space-x-4"
        variants={motionVariants.listItemsContainer}
      >
        {[0, 1, 2, 3].map((dependents) => (
          <MotionButton
            variants={motionVariants.itemContainerWithFade}
            onClick={() => props.onSelect(dependents)}
            variant="secondary"
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
