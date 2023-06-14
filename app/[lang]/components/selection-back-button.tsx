import { ArrowLeft } from "lucide-react"

import { JobDB } from "@/lib/job-db"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
  onPrev: () => void
  className?: string
  jobDB: JobDB
}

export default function BackButton({
  onPrev,
  className,
  jobDB,
  ...props
}: BackButtonProps) {
  return (
    <Button
      variant="link"
      size="sm"
      className={cn(
        "mb-4 flex h-auto items-center space-x-2 self-start px-0",
        className
      )}
      onClick={onPrev}
      {...props}
    >
      <ArrowLeft size="1em" />
      <span>{jobDB.getLocale("generic-backButtonLabel")}</span>
    </Button>
  )
}
