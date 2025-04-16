import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const inputVariants = cva(
   'flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:opacity-50 md:text-sm',
   {
      variants: {
         variant: {
            default:
               'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-gray-300 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            custom:
               'h-12 w-full rounded-md border bg-[var(--color-gray-900)] px-5 py-3.5 text-base text-[var(--color-base-white)] placeholder-[var(--color-neutral-300)] focus:border-[var(--color-warning-500)] border-[var(--color-neutral-500)]',
         },
         state: {
            error: 'border-[var(--color-danger-500)] text-destructive placeholder-destructive/70',
            neutral: 'border-[var(--color-neutral-500)] text-white',
         },
      },
      defaultVariants: {
         variant: 'default',
         state: 'neutral',
      },
   }
)

interface InputProps extends React.ComponentProps<'input'>, VariantProps<typeof inputVariants> {
   isPassword?: boolean
   error?: string
}

const Input: React.FC<InputProps> = ({ className, type, variant, state, isPassword, error, ...props }) => {
   const [isVisible, setIsVisible,] = React.useState(false)
   return (
      <div>
         <div className='relative space-y-1'>
            <input
               type={isPassword ? (isVisible ? 'text' : 'password') : type}
               className={cn(inputVariants({ variant, state, }), 'pr-12', className)}
               aria-invalid={!!error}
               {...props}
            />
            {isPassword && (
               <span
                  onClick={() => setIsVisible(!isVisible)}
                  className='absolute top-[50%] right-3 translate-y-[-50%] cursor-pointer text-2xl text-gray-500'
               >
                  {isVisible ? <FaEye /> : <FaEyeSlash />}
               </span>
            )}
         </div>
         {error && <p className='text-sm text-[var(--color-danger-500)]'>{error}</p>}
      </div>
   )
}

export { Input, inputVariants }

// import * as React from "react"

// import { cn } from "@/lib/utils"

// function Input({ className, type, ...props }: React.ComponentProps<"input">) {
//   return (
//     <input
//       type={type}
//       data-slot="input"
//       className={cn(
//         "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//         "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
//         "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
//         className
//       )}
//       {...props}
//     />
//   )
// }

// export { Input }
