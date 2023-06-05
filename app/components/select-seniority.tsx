"use client"

import { JobData } from "@/api/airtable"
import { zodResolver } from "@hookform/resolvers/zod"
import { differenceInYears, isValid } from "date-fns"
import { ArrowLeft } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const seniorityFormSchema = z.object({
  careerStart: z
    .string()
    .transform((val) => {
      if (!val) {
        return false
      }

      const date = new Date(val)

      if (isValid(date) === false) {
        return false
      }

      return date
    })
    .pipe(z.date().min(new Date("1970-01-01")).max(new Date())),
})

interface SelectSeniorityProps {
  jobData: JobData
  onSelect: (seniority: Date) => void
  onPrev: () => void
  careerStart: Date | null
}

export default function SelectSeniority(props: SelectSeniorityProps) {
  const form = useForm<
    z.input<typeof seniorityFormSchema>,
    undefined,
    z.infer<typeof seniorityFormSchema>
  >({
    defaultValues: {
      careerStart: props.careerStart?.toString() ?? "",
    },
    mode: "onChange",
    resolver: zodResolver(seniorityFormSchema),
  })

  return (
    <form
      onSubmit={form.handleSubmit(({ careerStart }) =>
        props.onSelect(careerStart)
      )}
      className="space-y-2"
    >
      <Button
        variant="ghost"
        className="text-grey-600 flex items-center space-x-2 self-start"
        onClick={props.onPrev}
      >
        <ArrowLeft size="1em" />
        <span>Retour</span>
      </Button>

      <h2 className="font-serif text-2xl">Sélectionne ta séniorité</h2>

      <p className="text-muted-foreground">
        Indique la date de ton premier emploi, après tes études (au mois près)
      </p>

      <div className="pt-8">
        <Controller
          control={form.control}
          name="careerStart"
          render={({ field }) => (
            <Input type="date" className="max-w-xs" {...field} />
          )}
        />
      </div>

      <Button type="submit" isDisabled={form.formState.isValid === false}>
        Continuer
      </Button>
    </form>
  )
}
