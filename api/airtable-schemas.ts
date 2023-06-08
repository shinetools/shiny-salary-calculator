import { dependentsSchema } from "@/schemas/dependents.schema"
import { jobSchema } from "@/schemas/job.schema"
import { levelSchema } from "@/schemas/level.schema"
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
