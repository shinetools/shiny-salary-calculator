import { dependentsSchema } from "@/schemas/dependents.schema"
import { jobIdSchema } from "@/schemas/job-id.schema"
import { jobSchema } from "@/schemas/job.schema"
import { levelSchema } from "@/schemas/level.schema"
import { localeSchema } from "@/schemas/locale.schema"
import { workLocationSchema } from "@/schemas/work-location.schema"
import { z } from "zod"

/**
 * Schemas for objects coming from Airtable.
 */
export const levelsDataSchema = z.array(levelSchema)

export const jobsDataSchema = z.array(jobSchema)

export const seniorityDataSchema = z.array(
  z.object({ seniority: z.number(), bonus: z.number() })
)

export const dependentsDataSchema = z.array(
  z.object({ dependents: dependentsSchema, bonus: z.number() })
)

export const jobCategoriesDataSchema = z.array(
  z.object({
    category_id: z.string(),
    fr_label: z.string(),
    en_label: z.string().optional(),
    jobs: z.array(jobIdSchema),
  })
)

export const workLocationDataSchema = z
  .array(
    z.object({
      location: workLocationSchema,
      bonus: z.number(),
    })
  )
  .transform((workLocations) =>
    Object.fromEntries(
      workLocations.map(({ location, bonus }) => [location, bonus])
    )
  )
  .pipe(z.record(workLocationSchema, z.number()))

export const perksDataSchema = z.array(
  z.object({
    icon_name: z.string(),
    fr_title: z.string(),
    en_title: z.string().optional(),
  })
)

export const localesDataSchema = z.array(localeSchema)
