import { z } from "zod"

import { jobIdSchema } from "./job-id.schema"
import { levelIdSchema } from "./level-id.schema"

export const jobSchema = z.object({
  id: jobIdSchema,
  levels: z.array(levelIdSchema).optional(),
  label: z.string().min(1),
})

export type Job = z.infer<typeof jobSchema>
