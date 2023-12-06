import { zodResolver } from "@hookform/resolvers/zod"
import { getYear, isPast, isValid } from "date-fns"
import { motion } from "framer-motion"
import { GraduationCap } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { JobDB } from "@/lib/job-db"
import { Lang } from "@/lib/locales"
import { motionVariants } from "@/lib/motion-variants"
import { cn } from "@/lib/utils"
import { MotionButton } from "@/components/ui/button"
import { MotionInput } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import BackButton from "../components/selection-back-button"

function monthsForLocale(localeName: string) {
  const { format } = new Intl.DateTimeFormat(localeName, { month: "long" })

  return [...Array(12).keys()].map((m) =>
    format(new Date(Date.UTC(2023, m % 12)))
  )
}

const currentYear = getYear(new Date())

function yearsForLocale(localeName: Lang) {
  const MAX_SENIORITY = 21

  const getMaxSeniorityLabel = (year: number) =>
    localeName === "fr" ? `${year} ou avant` : `${year} or before`

  return new Array(MAX_SENIORITY).fill("").map((val, index) => {
    return {
      value: currentYear - index,
      label:
        index === MAX_SENIORITY - 1
          ? getMaxSeniorityLabel(currentYear - index)
          : `${currentYear - index}`,
    }
  })
}

const seniorityFormSchema = z.object({
  careerStart: z
    .discriminatedUnion("hasZeroXP", [
      z.object({
        hasZeroXP: z.literal(true),
        month: z.literal(null),
        year: z.literal(null),
      }),

      z.object({
        hasZeroXP: z.literal(false),
        month: z.string(),
        year: z.string().min(4),
      }),
    ])

    .transform((val) => {
      if (val.hasZeroXP) {
        return false
      }

      const date = new Date(
        `${val.year}-${val.month.toString().padStart(2, "0")}-01`
      )

      return date
    })
    .refine((careerStartDate) => {
      // The candidate has zero XP.
      if (careerStartDate === false) {
        return true
      }

      return isValid(careerStartDate) && isPast(careerStartDate)
    }),
})

interface SelectSeniorityProps {
  jobDB: JobDB
  onSelect: (seniority: Date | false) => void
  onPrev: () => void
  careerStart: Date | null | false
}

export default function SelectSeniority(props: SelectSeniorityProps) {
  const form = useForm<
    z.input<typeof seniorityFormSchema>,
    undefined,
    z.output<typeof seniorityFormSchema>
  >({
    defaultValues: {
      careerStart:
        props.careerStart === false
          ? { hasZeroXP: true }
          : {
              hasZeroXP: false,
              month: props.careerStart
                ? (props.careerStart.getMonth() + 1).toString()
                : undefined,
              year: props.careerStart?.getFullYear().toString(),
            },
    },
    mode: "onChange",
    resolver: zodResolver(seniorityFormSchema),
  })

  return (
    <motion.form
      initial="hidden"
      animate="visible"
      variants={motionVariants.mainContainer}
      onSubmit={form.handleSubmit(({ careerStart }) =>
        props.onSelect(careerStart)
      )}
    >
      <BackButton onPrev={props.onPrev} jobDB={props.jobDB} />

      <h2 className="font-serif text-2xl">
        {props.jobDB.getLocale("selection-seniority-title")}
      </h2>

      <p className="text-muted-foreground mb-8">
        {props.jobDB.getLocale("selection-seniority-subtitle")}
      </p>

      <motion.div
        className="mb-8 grid grid-cols-2 gap-4"
        variants={motionVariants.listItemsContainer}
      >
        <Controller
          control={form.control}
          name="careerStart.month"
          render={({ field }) => (
            <motion.div variants={motionVariants.itemContainerWithFade}>
              <Select
                onValueChange={(val) => {
                  form.setValue("careerStart.hasZeroXP", false)
                  field.onChange(val)
                }}
                value={field.value ?? undefined}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={props.jobDB.getLocale(
                      "selection-seniority-labelMonth"
                    )}
                  />
                </SelectTrigger>

                <SelectContent>
                  {monthsForLocale(props.jobDB.lang).map((month, index) => (
                    <SelectItem value={(index + 1).toString()} key={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          )}
        />

        <Controller
          control={form.control}
          name="careerStart.year"
          render={({ field }) => (
            <motion.div variants={motionVariants.itemContainerWithFade}>
              <Select
                onValueChange={(val) => {
                  form.setValue("careerStart.hasZeroXP", false)
                  field.onChange(val)
                }}
                value={field.value ?? undefined}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={props.jobDB.getLocale(
                      "selection-seniority-labelYear"
                    )}
                  />
                </SelectTrigger>

                <SelectContent>
                  {yearsForLocale(props.jobDB.lang).map(({ label, value }) => (
                    <SelectItem value={value.toString()} key={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          )}
        />
      </motion.div>

      <motion.div
        className={cn(
          "flex flex-col items-center justify-between space-x-4 space-y-4 md:flex-row md:space-y-0"
        )}
        variants={motionVariants.listItemsContainer}
      >
        <MotionButton
          variants={motionVariants.itemContainerWithFade}
          variant="link"
          className="text-grey-700 px-0"
          onClick={() => {
            form.setValue("careerStart.month", null)
            form.setValue("careerStart.year", null)
            form.setValue("careerStart.hasZeroXP", true)
            form.handleSubmit(({ careerStart }) => props.onSelect(careerStart))
          }}
        >
          <GraduationCap size="1em" className="mr-2" />

          {props.jobDB.getLocale("selection-seniority-newGrad")}
        </MotionButton>

        <MotionButton
          variants={motionVariants.itemContainerWithFade}
          type="submit"
          isDisabled={form.formState.isValid === false}
        >
          {props.jobDB.getLocale("selection-seniority-cta")}
        </MotionButton>
      </motion.div>
    </motion.form>
  )
}
