import { JobId } from "@/schemas/job-id.schema"
import { motion } from "framer-motion"

import { JobDB } from "@/lib/job-db"
import { motionVariants } from "@/lib/motion-variants"
import { translate } from "@/lib/translate"
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
      <BackButton onPrev={props.onPrev} jobDB={props.jobDB} />

      <h2 className="mb-4 font-serif text-2xl">
        {props.jobDB.getLocale("selection-job-title")}
      </h2>

      <div className="-ml-3 space-y-6">
        {props.jobDB.getJobsByCategory.map(({ category, jobs }) => (
          <motion.div
            variants={motionVariants.listItemsContainer}
            key={category.category_id}
          >
            <h3 className="ml-3 text-lg font-medium">
              {translate(props.jobDB.lang, {
                fr: category.fr_label,
                en: category.en_label,
              })}
            </h3>

            <div className="flex flex-wrap space-x-3 space-y-3">
              {jobs.map((job) => {
                console.log(job)

                return (
                  <motion.div
                    variants={motionVariants.itemContainerWithFade}
                    className="first-of-type:ml-3 first-of-type:mt-3"
                    key={job.id}
                  >
                    <Button
                      onClick={() => props.onSelect(job.id)}
                      variant="secondary"
                    >
                      {translate(props.jobDB.lang, {
                        fr: job.fr_label,
                        en: job.en_label,
                      })}
                    </Button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
