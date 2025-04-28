import Link from 'next/link'

type ElementVariants =
   | 'h4medium'
   | 'textMregular'
   | 'textSmedium'
   | 'textMmedium'
   | 'textMSemiBold'
   | 'h4mobileMedium'
   | 'h6mobileMedium'
   | 'textLregular'
   | 'textLmedium'
   | 'h2semiBold'
   | 'h3semiBold'
   | 'h5medium'
   | 'h6medium'
   | 'h5semiBold'
   | 'h7semiBold'

type TextProps = {
   as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'a'
   variant: ElementVariants
   children: React.ReactNode
   className?: string
   onClick?: () => void
   href?: string
}

const Text = ({ as = 'p', variant, children, className, onClick, href }: TextProps) => {
   const Component = as

   const variantClasses: Record<ElementVariants, string> = {
      h4medium: 'text-[32px] leading-11 font-medium tracking-[-0.01em]', // 32/44/medium/
      h5medium: 'text-[28px] leading-10 font-medium tracking-[-0.01em]', // 28/40/medium
      h6medium: 'text-2xl leading-9 font-medium tracking-[-0.01em]', // 24/36/medium
      h2semiBold: 'text-[40px] leading-[50px] font-semibold tracking-[-0.01em]', // 40/50/semi-bold
      h3semiBold: 'text-4xl leading-[46px] font-semibold tracking-[-0.01em]', // 36/46/semi-bold
      h5semiBold: 'text-[28px] leading-10 font-semibold tracking-[-0.01em]', // 28/40/semi-bold
      h7semiBold: 'text-xl leading-[30px] font-semibold tracking-[-0.01em]', // 20/30/semi-bold
      h4mobileMedium: 'text-[28px] leading-10 font-medium tracking-[-0.01em]', // 28/40/medium
      h6mobileMedium: 'text-xl leading-[30px] font-medium tracking-[-0.01em]', // 20/30/medium
      textMregular: 'text-base leading-[26px] font-normal tracking-normal', // 16/26/normal
      textSmedium: 'text-sm leading-6 font-medium tracking-normal', // 14/24/medium
      textMmedium: 'text-base leading-[26px] font-medium tracking-normal', // 16/26/medium
      textMSemiBold: 'text-base leading-[26px] font-semibold tracking-normal', // 16/26/medium
      textLmedium: 'text-lg leading-7 font-medium tracking-normal', // 18/28/medium
      textLregular: 'text-lg leading-7 font-normal tracking-normal', // 18/28/normal
   }

   if (href) {
      return (
         <Link href={href} className={`${variantClasses[variant]} ${className || ''}`}>
            {children}
         </Link>
      )
   }

   // Warunkowe dodanie href dla komponentu "a"
   return (
      <Component className={`${variantClasses[variant]} ${className || ''}`} onClick={onClick}>
         {children}
      </Component>
   )
}

export default Text
