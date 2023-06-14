import { z } from "zod"

export const localeSchema = z.object({
  id: z.string(),
  fr: z.string(),
  en: z.string().optional(),
})

export type Level = z.infer<typeof localeSchema>
