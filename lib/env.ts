import { z } from "zod"

let envSchema = z.object({
  AIRTABLE_API_KEY: z.string().min(1),
  AIRTABLE_BASE_ID: z.string().min(1),
})

const ENV = envSchema.parse(process.env)

export default ENV
