import { z } from "zod"

export const workLocationSchema = z.enum([
  "in-person",
  "full-remote-france",
  "full-remote-europe",
])

export type WorkLocation = z.infer<typeof workLocationSchema>
