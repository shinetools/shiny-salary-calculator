import { z } from "zod"

import { jobIdSchema } from "./job-id.schema"
import { levelIdSchema } from "./level-id.schema"

export const jobSchema = z.object({
  id: jobIdSchema,
  levels: z.array(levelIdSchema).optional(),
  fr_label: z.string(),
  en_label: z.string().optional(),
})

export type Job = z.infer<typeof jobSchema>
