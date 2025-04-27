type ElementVariants =
   | 'h4medium'
   | 'textMregular'
   | 'textSmedium'
   | 'textMmedium'
   | 'h4mobileMedium'
   | 'h6mobileMedium'
   | 'textLregular'
   | 'textLmedium'
   | 'h5medium'
   | 'h5semiBold'
   | 'h7semiBold'

type TextProps = {
   as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
   variant: ElementVariants
   children: React.ReactNode
   className?: string
   onClick?: () => void
}

const Text = ({ as = 'p', variant, children, className, onClick }: TextProps) => {
   const Component = as // element ('h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span')

   const variantClasses: Record<ElementVariants, string> = {
      h4medium: 'text-[32px] leading-11 font-medium tracking-[-0.01em]', // 32/44/medium/
      h5medium: 'text-[28px] leading-10 font-medium tracking-[-0.01em]', // 28/40/medium
      h5semiBold: 'text-[28px] leading-10 font-semibold tracking-[-0.01em]', // 28/40/semi-bold
      h7semiBold: 'text-xl leading-[30px] font-semibold tracking-[-0.01em]', // 20/30/semi-bold
      h4mobileMedium: 'text-[28px] leading-10 font-medium tracking-[-0.01em]', // 28/40/medium
      h6mobileMedium: 'text-xl leading-[30px] font-medium tracking-[-0.01em]', // 20/30/medium
      textMregular: 'text-base leading-[26px] font-normal tracking-normal', // 16/26/normal
      textSmedium: 'text-sm leading-6 font-medium tracking-normal', // 14/24/medium
      textMmedium: 'text-base leading-[26px] font-medium tracking-normal', // 16/26/medium
      textLmedium: 'text-lg leading-7 font-medium tracking-normal', // 18/28/medium
      textLregular: 'text-lg leading-7 font-normal tracking-normal', // 18/28/normal
   }

   return (
      <Component className={`${variantClasses[variant]} ${className || ''}`} onClick={onClick}>
         {children}
      </Component>
   )
}

export default Text
