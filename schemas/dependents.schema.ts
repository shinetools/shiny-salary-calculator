import { z } from "zod"

export const dependentsSchema = z.number().int().nonnegative()

export type Dependents = z.infer<typeof dependentsSchema>
