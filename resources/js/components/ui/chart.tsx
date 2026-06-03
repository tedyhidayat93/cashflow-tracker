"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

const Chart = React.forwardRef<
  React.ElementRef<typeof RechartsPrimitive.ResponsiveContainer>,
  React.ComponentPropsWithoutRef<typeof RechartsPrimitive.ResponsiveContainer>
>(({ className, ...props }, ref) => (
  <RechartsPrimitive.ResponsiveContainer
    ref={ref}
    className={cn("h-full w-full", className)}
    {...props}
  />
))
Chart.displayName = "Chart"

export { Chart }
