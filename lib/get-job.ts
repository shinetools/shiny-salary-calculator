import { JobData } from "@/api/airtable"
import { JobId } from "@/schemas/job-id.schema"

export const getJob = (jobData: JobData, jobId: JobId) => {
  return jobData.jobs.find((job) => job.id === jobId)!
}
