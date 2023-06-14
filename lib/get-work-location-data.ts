import { WorkLocation } from "@/schemas/work-location.schema"

const WORK_LOCATION_DATA = {
  "in-person": {
    icon: "/assets/work-location-assets/in-person.png",
    title: "Région parisienne",
    description:
      "Tu bénéficieras d’une prime de siège de +3 500 € / an par équité pour le coût que représente les full-remotes.",
  },
  "full-remote-france": {
    icon: "/assets/work-location-assets/full-remote-france.png",
    title: "Full-remote France",
    description:
      "Tu vis hors région parisienne, et devra te rendre dans les bureaux minimum 2j / mois (au frais de Shine).",
  },
  "full-remote-europe": {
    icon: "/assets/work-location-assets/full-remote-europe.png",
    title: "Full-remote Europe",
    description:
      "Tu vis dans l’Union Européenne, et devra te rendre dans les bureaux minimum 2 fois par an (au frais de Shine).",
  },
} satisfies Record<
  WorkLocation,
  {
    icon: string
    title: string
    description: string
  }
>

export function getWorkLocationData(workLocation: WorkLocation) {
  return WORK_LOCATION_DATA[workLocation]
}
