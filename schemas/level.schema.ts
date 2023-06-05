import { z } from "zod"

import { jobIdSchema } from "./job-id.schema"
import { levelIdSchema } from "./level-id.schema"

export const levelSchema = z.object({
  id: levelIdSchema,
  label: z.string().optional(),
  level: z.string(),
  baseSalary: z.number().min(0).max(1000000),
  jobId: z
    .array(jobIdSchema)
    .length(1)
    .transform(([job]) => job),
})

export type Level = z.infer<typeof levelSchema>
