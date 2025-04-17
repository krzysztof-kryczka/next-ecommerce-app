'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const labelVariants = cva(
   'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
   {
      variants: {
         variant: {
            default:
               'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            custom: 'text-lg font-medium',
         },
      },
      defaultVariants: {
         variant: 'default',
      },
   },
)

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement>, VariantProps<typeof labelVariants> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, variant, ...props }, ref) => (
   <label ref={ref} className={cn(labelVariants({ variant }), className)} {...props} />
))

Label.displayName = 'Label'

export { Label, labelVariants }

// "use client"

// import * as React from "react"
// import * as LabelPrimitive from "@radix-ui/react-label"

// import { cn } from "@/lib/utils"

// function Label({
//   className,
//   ...props
// }: React.ComponentProps<typeof LabelPrimitive.Root>) {
//   return (
//     <LabelPrimitive.Root
//       data-slot="label"
//       className={cn(
//         "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
//         className
//       )}
//       {...props}
//     />
//   )
// }

// export { Label }
