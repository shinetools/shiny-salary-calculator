import { Variants } from "framer-motion"

export const motionVariants = {
  mainContainer: {
    hidden: {
      opacity: 0,
      y: -10,
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

  itemContainerWithScale: {
    hidden: { y: 10, scale: 0 },
    visible: { y: 0, scale: 1 },
  },

  itemContainerWithFade: {
    hidden: { opacity: 0, y: 4, scale: 0.8 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
} satisfies Record<string, Variants>
