import { Variants } from "framer-motion"

export const motionVariants = {
  mainContainer: {
    hidden: {
      opacity: 0,
      y: -3,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        // delayChildren: 0.125,
        staggerChildren: 0.125,
      },
    },
  },

  listItemsContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.035,
        staggerChildren: 0.035,
      },
    },
  },

  itemContainerWithFade: {
    hidden: { opacity: 0, y: 2, scale: 0.85 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },

  bigItemContainerWithFade: {
    hidden: { opacity: 0, y: 2, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
} satisfies Record<string, Variants>
