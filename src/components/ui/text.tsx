type ElementVariants = 'h4medium' | 'textMregular' | 'textMmedium'

type TextProps = {
   as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'
   variant: ElementVariants
   children: React.ReactNode
   className?: string
}

const Text = ({ as = 'p', variant, children, className }: TextProps) => {
   const Component = as // element ('h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p')

   const variantClasses: Record<ElementVariants, string> = {
      h4medium: 'text-[32px] leading-11 font-medium tracking-[-0.01em]',
      textMregular: 'text-base leading-[26px] font-normal tracking-normal',
      textMmedium: 'text-base leading-[26px] font-medium tracking-normal',
   }

   return <Component className={`${variantClasses[variant]} ${className || ''}`}>{children}</Component>
}

export default Text
