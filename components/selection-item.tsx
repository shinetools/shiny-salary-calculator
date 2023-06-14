"use client"

import { motion } from "framer-motion"
import { Edit3 } from "lucide-react"

import { motionVariants } from "@/lib/motion-variants"
import { cn } from "@/lib/utils"

interface SelectionItemProps {
  label: string
  currentSelection: string | null
  onClick: () => void
}

export default function SelectionItem(props: SelectionItemProps) {
  const hasValue = props.currentSelection !== null

  return (
    <motion.button
      onClick={props.onClick}
      className="bg-grey-200 hover:bg-grey-300 flex h-[58px] items-center justify-between space-x-4 rounded-xl border px-4 py-2 text-left transition-all"
    >
      <div className="overflow-hidden">
        <div className={cn("text-grey-600", hasValue && "text-xs")}>
          {props.label}
        </div>

        {props.currentSelection && (
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            {props.currentSelection}
          </div>
        )}
      </div>

      <div className="">
        <Edit3 className="text-grey-600" size={18} />
      </div>
    </motion.button>
  )
}
