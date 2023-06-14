import { z } from "zod"

export const perkSchema = z.object({
  title: z.string(),
  title_fr: z.string(),
  title_en: z.string(),
})

export type Level = z.infer<typeof perkSchema>
