import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-mindsync-blue focus:ring-offset-1",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-mindsync-blue-light text-mindsync-blue hover:bg-mindsync-blue/10",
        secondary:
          "border-transparent bg-mindsync-gray-pale text-mindsync-gray hover:bg-mindsync-gray-pale/80",
        ai:
          "border-transparent bg-mindsync-green/10 text-mindsync-green hover:bg-mindsync-green/20",
        destructive:
          "border-transparent bg-mindsync-red/10 text-mindsync-red hover:bg-mindsync-red/20",
        outline: "border border-mindsync-gray-light text-mindsync-gray hover:bg-mindsync-gray-pale",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
