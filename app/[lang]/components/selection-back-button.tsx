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
      <span>Retour</span>
    </Button>
  )
}
