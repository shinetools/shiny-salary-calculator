"use client"

import { Edit3 } from "lucide-react"

import { cn } from "@/lib/utils"

interface SelectionItemProps {
  label: string
  value: string | null
  onClick: () => void
}

export default function SelectionItem(props: SelectionItemProps) {
  const hasValue = props.value !== null

  return (
    <button
      onClick={props.onClick}
      className="bg-grey-200 hover:bg-grey-200/50 flex h-[58px] items-center justify-between space-x-4 rounded-xl border px-3 py-2 text-left transition-all"
    >
      <div className="flex flex-col justify-center">
        <div className={cn("text-grey-600", hasValue && "text-xs")}>
          {props.label}
        </div>

        {props.value && <div className={cn("")}>{props.value}</div>}
      </div>

      <div>
        <Edit3 className="text-grey-600" size={18} />
      </div>
    </button>
  )
}
