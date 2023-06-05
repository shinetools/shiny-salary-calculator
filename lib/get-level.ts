import { JobData } from "@/api/airtable"
import { LevelId } from "@/schemas/level-id.schema"

export const getLevel = (jobData: JobData, levelId: LevelId) => {
  return jobData.levels.find((level) => level.id === levelId)!
}
