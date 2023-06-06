import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

interface BackButtonProps {
  onPrev: () => void
  className?: string
}

export default function BackButton({ onPrev, ...props }: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      className="text-grey-600 flex items-center space-x-2 self-start"
      onClick={onPrev}
      {...props}
    >
      <ArrowLeft size="1em" />
      <span>Retour</span>
    </Button>
  )
}
