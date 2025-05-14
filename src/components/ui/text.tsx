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
   | 'h4semiBold'
   | 'h5medium'
   | 'h6medium'
   | 'h7medium'
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
      h4medium:
         'lg:text-[32px] lg:leading-11 font-medium tracking-[-0.01em] md:text-[28px] md:leading-9 sm:text-[24px] sm:leading-8',
      h5medium:
         'lg:text-[28px] lg:leading-10 font-medium tracking-[-0.01em] md:text-[24px] md:leading-8 sm:text-[22px] sm:leading-8',
      h6medium:
         'lg:text-2xl lg:leading-9 font-medium tracking-[-0.01em] md:text-xl md:leading-8 sm:text-lg sm:leading-7',
      h7medium:
         'lg:text-xl lg:leading-[30px] font-medium tracking-[-0.01em] md:text-lg md:leading-7 sm:text-base sm:leading-6',
      h2semiBold:
         'lg:text-[40px] lg:leading-[50px] font-semibold tracking-[-0.01em] md:text-[32px] md:leading-10 sm:text-[28px] sm:leading-9',
      h3semiBold:
         'lg:text-4xl lg:leading-[46px] font-semibold tracking-[-0.01em] md:text-[30px] md:leading-9 sm:text-[26px] sm:leading-8',
      h4semiBold:
         'lg:text-[32px] lg:leading-[44px] font-semibold tracking-[-0.01em]',
      h5semiBold:
         'lg:text-[28px] lg:leading-10 font-semibold tracking-[-0.01em] md:text-[24px] md:leading-8 sm:text-[22px] sm:leading-7',
      h7semiBold:
         'lg:text-xl lg:leading-[30px] font-semibold tracking-[-0.01em] md:text-lg md:leading-7 sm:text-base sm:leading-6',
      h4mobileMedium:
         'lg:text-[28px] lg:leading-10 font-medium tracking-[-0.01em] md:text-[24px] md:leading-8 sm:text-[22px] sm:leading-8',
      h6mobileMedium:
         'lg:text-xl lg:leading-[30px] font-medium tracking-[-0.01em] md:text-lg md:leading-7 sm:text-base sm:leading-6',
      textMregular:
         'lg:text-base lg:leading-[26px] font-normal tracking-normal md:text-sm md:leading-6 sm:text-sm sm:leading-5',
      textSmedium:
         'lg:text-sm lg:leading-6 font-medium tracking-normal md:text-xs md:leading-5 sm:text-xs sm:leading-4',
      textMmedium:
         'lg:text-base lg:leading-[26px] font-medium tracking-normal md:text-sm md:leading-6 sm:text-sm sm:leading-5',
      textMSemiBold:
         'lg:text-base lg:leading-[26px] font-semibold tracking-normal md:text-sm md:leading-6 sm:text-sm sm:leading-5',
      textLmedium:
         'lg:text-lg lg:leading-7 font-medium tracking-normal md:text-base md:leading-7 sm:text-base sm:leading-6',
      textLregular:
         'lg:text-lg lg:leading-7 font-normal tracking-normal md:text-base md:leading-7 sm:text-base sm:leading-6',
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
