import { z } from "zod"

export const dependentsSchema = z.enum(["0", "1", "2", "3+"])

export type Dependents = z.infer<typeof dependentsSchema>
