import { ArrowLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
  onPrev: () => void
  className?: string
}

export default function BackButton({
  onPrev,
  className,
  ...props
}: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "text-grey-600 mb-1 flex items-center space-x-2 self-start",
        className
      )}
      onClick={onPrev}
      {...props}
    >
      <ArrowLeft size="1em" />
      <span>Retour</span>
    </Button>
  )
}
