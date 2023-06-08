import { useCallback } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import CountUp from "react-countup"

import { FINANCIAL_PERKS } from "@/lib/get-financial-perks"
import { JobDB } from "@/lib/job-db"
import { usePrevious } from "@/lib/use-previous"

import { SelectionSchema } from "../page.client"
import { ValidSelectionSchema, validSelectionSchema } from "./simulation-panel"

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
        src="/flower.png"
        width={120}
        height={120}
        alt=""
        className="absolute right-2 top-2"
      />

      <h2 className="font-medium">Salaire annuel brut</h2>

      <div className="mb-8 font-serif text-4xl">
        <CountUp
          start={previousSalary ?? 0}
          end={props.simulation.salary}
          formattingFn={formatter}
        />
      </div>

      <h2 className="mb-3 text-lg font-medium">Avantages additionnels :</h2>

      <div className="space-y-4">
        {FINANCIAL_PERKS.map((perk) => {
          return (
            <div key={perk.id} className="grid grid-cols-[1fr_auto]">
              <div>
                <h3 className="font-medium">{perk.title}</h3>
                <div className="text-xs text-blue-100">{perk.description}</div>
              </div>

              <AnimatePresence mode="popLayout">
                <motion.div
                  className="text-end font-medium"
                  key={props.simulation[perk.id]}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {currencyFormatter.format(props.simulation[perk.id])}
                </motion.div>
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
