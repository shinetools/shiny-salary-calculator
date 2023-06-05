import type { ComponentPropsWithoutRef } from "react"
import React from "react"
import { Loader2 } from "lucide-react"

import { cn } from "../../lib/utils"

interface LoaderProps extends ComponentPropsWithoutRef<typeof Loader2> {}

export const Loader = React.forwardRef<SVGSVGElement, LoaderProps>(
  ({ className, ...props }, ref) => (
    <Loader2 className={cn("animate-spin", className)} ref={ref} {...props} />
  )
)

Loader.displayName = "Loader"
