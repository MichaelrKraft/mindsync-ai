import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-mindsync-gray transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-mindsync-gray-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mindsync-blue focus-visible:ring-offset-1 focus-visible:border-mindsync-blue disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-mindsync-gray-pale",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
