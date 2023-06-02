import { differenceInYears } from "date-fns"

export const computeSeniority = (careerStartDate: Date) => {
  return differenceInYears(new Date(), careerStartDate)
}
