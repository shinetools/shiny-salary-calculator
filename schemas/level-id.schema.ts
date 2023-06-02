import { z } from "zod";

export const levelIdSchema = z.string().min(1).brand<"LevelId">();

export type LevelId = z.infer<typeof levelIdSchema>;
