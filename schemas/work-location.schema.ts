import { z } from "zod"

export const workLocationSchema = z.enum(["in-person", "full-remote-france"])

export type WorkLocation = z.infer<typeof workLocationSchema>
