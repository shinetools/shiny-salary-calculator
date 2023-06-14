"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { isPast, isValid } from "date-fns"
import { motion } from "framer-motion"
import { GraduationCap } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { JobDB } from "@/lib/job-db"
import { motionVariants } from "@/lib/motion-variants"
import { cn } from "@/lib/utils"
import { Button, MotionButton } from "@/components/ui/button"
import { Input, MotionInput } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import BackButton from "../components/selection-back-button"

function monthsForLocale(localeName: "fr-FR") {
  const { format } = new Intl.DateTimeFormat(localeName, { month: "long" })

  return [...Array(12).keys()].map((m) =>
    format(new Date(Date.UTC(2023, m % 12)))
  )
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
              month: props.careerStart?.getMonth().toString(),
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
      <BackButton onPrev={props.onPrev} />

      <h2 className="font-serif text-2xl">Sélectionne ta séniorité</h2>

      <p className="text-muted-foreground mb-8">
        Indique la date de ton premier emploi, après tes études (au mois près)
      </p>

      <motion.div
        className="mb-6 grid grid-cols-2 gap-4"
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
                  <SelectValue placeholder="Mois" />
                </SelectTrigger>

                <SelectContent>
                  {monthsForLocale("fr-FR").map((month, index) => (
                    <SelectItem value={index.toString()} key={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          )}
        />

        <MotionInput
          variants={motionVariants.itemContainerWithFade}
          type="number"
          placeholder="Année"
          {...form.register("careerStart.year", {
            onChange() {
              form.setValue("careerStart.hasZeroXP", false)
            },
          })}
          onKeyDown={(event) => {
            /**
             * I can't understand why pressing enter on this input will close the form
             * WITHOUT submitting it. Meaning validation is not evaluated, and data is lost.
             */
            if (event.key === "Enter") event.preventDefault()
          }}
        />
      </motion.div>

      <motion.div
        className="flex items-center justify-between space-x-4"
        variants={motionVariants.listItemsContainer}
      >
        <MotionButton
          variants={motionVariants.itemContainerWithFade}
          variant="ghost"
          className="text-grey-700"
          onClick={() => {
            form.setValue("careerStart.month", null)
            form.setValue("careerStart.year", null)
            form.setValue("careerStart.hasZeroXP", true)
            form.handleSubmit(({ careerStart }) => props.onSelect(careerStart))
          }}
        >
          <GraduationCap size="1em" className="mr-2" />
          {"Je n'ai pas encore commencé à travailler"}
        </MotionButton>

        <MotionButton
          variants={motionVariants.itemContainerWithFade}
          type="submit"
          isDisabled={form.formState.isValid === false}
        >
          Continuer
        </MotionButton>
      </motion.div>
    </motion.form>
  )
}
