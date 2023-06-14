import { useCallback } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import CountUp from "react-countup"

import { JobDB } from "@/lib/job-db"
import { usePrevious } from "@/lib/use-previous"

/**
 * Currency formatter
 */
const currencyFormatter = new Intl.NumberFormat("fr", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
})

interface SimulationResultProps {
  simulation: ReturnType<JobDB["computeSimulationData"]>
  jobDB: JobDB
}

export default function SimulationResult(props: SimulationResultProps) {
  const salary = props.simulation.salary
  const previousSalary = usePrevious(salary)

  const formatter = useCallback(
    (val: number) => currencyFormatter.format(val),
    []
  )

  return (
    <div className="relative h-[395px] rounded-lg bg-blue-800 p-6 text-white ">
      <Image
        src="/assets/flower.png"
        width={120}
        height={120}
        alt=""
        className="absolute right-0 top-0"
      />

      <h2 className="font-medium">
        {props.jobDB.getLocale("simulation-title")}
      </h2>

      <div className="mb-8 font-serif text-4xl font-medium">
        <CountUp
          start={previousSalary ?? 0}
          end={props.simulation.salary}
          formattingFn={formatter}
        />
      </div>

      <h2 className="mb-3 text-lg font-medium">
        {props.jobDB.getLocale("simulation-financialPerks-title")}
      </h2>

      <div className="space-y-4">
        {(["holidaysBonus", "profitSharing", "shadowShares"] as const).map(
          (perk) => {
            return (
              <div key={perk} className="grid grid-cols-[1fr_auto]">
                <div>
                  <h3 className="font-medium">
                    {props.jobDB.getLocale(
                      `simulation-financialPerks-${perk}-title`
                    )}
                  </h3>
                  <div className="text-xs text-blue-100">
                    {props.jobDB.getLocale(
                      `simulation-financialPerks-${perk}-description`
                    )}
                  </div>
                </div>

                <AnimatePresence mode="popLayout">
                  <motion.div
                    className="text-end font-medium"
                    key={props.simulation[perk]}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {currencyFormatter.format(props.simulation[perk])}
                  </motion.div>
                </AnimatePresence>
              </div>
            )
          }
        )}
      </div>
    </div>
  )
}
