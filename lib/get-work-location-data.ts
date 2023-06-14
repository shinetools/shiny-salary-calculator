import { WorkLocation } from "@/schemas/work-location.schema"

import { Lang } from "@/app/[lang]/page"

import { JobDB } from "./job-db"

const WORK_LOCATION_DATA = {
  "in-person": {
    icon: "/assets/work-location-assets/in-person.png",
    title: "selection-workLocation-inPerson-title",
    description: "selection-workLocation-inPerson-description",
  },
  "full-remote-france": {
    icon: "/assets/work-location-assets/full-remote-france.png",
    title: "selection-workLocation-fullRemoteFrance-title",
    description: "selection-workLocation-fullRemoteFrance-description",
  },
  "full-remote-europe": {
    icon: "/assets/work-location-assets/full-remote-europe.png",
    title: "selection-workLocation-fullRemoteEurope-title",
    description: "selection-workLocation-fullRemoteEurope-description",
  },
} satisfies Record<
  WorkLocation,
  {
    icon: string
    title: string
    description: string
  }
>

export function getWorkLocationData(workLocation: WorkLocation, jobDB: JobDB) {
  const data = WORK_LOCATION_DATA[workLocation]

  return {
    icon: data.icon,
    title: jobDB.getLocale(data.title),
    description: jobDB.getLocale(data.description),
  }
}
