import { z } from "zod";

export const jobIdSchema = z.string().min(1).brand<"JobId">();

export type JobId = z.infer<typeof jobIdSchema>;
