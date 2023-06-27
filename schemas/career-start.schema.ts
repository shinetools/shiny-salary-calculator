import { z } from "zod"

export const careerStartSchema = z.date().or(z.literal(false))

export type CareerStart = z.infer<typeof careerStartSchema>
