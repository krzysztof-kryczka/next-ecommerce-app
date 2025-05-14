import { useState, useEffect, useRef, ReactNode } from 'react'
import ArrowLeftIcon from './icons/ArrowLeftIcon'
import ArrowRightIcon from './icons/ArrowRightIcon'
import Text from '@/components/ui/text'
import { Button } from './ui/button'

interface ScrollableListProps {
   title: ReactNode
   children: ReactNode
   containerClassName?: string
   gapClassName?: string
}

const ScrollableList = ({ title, children, containerClassName = '', gapClassName = 'gap-8' }: ScrollableListProps) => {
   const [isExpanded, setIsExpanded] = useState(false)
   const [isOverflowing, setIsOverflowing] = useState(false)
   const containerRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
      const checkOverflow = () => {
         if (containerRef.current) {
            setIsOverflowing(containerRef.current.scrollWidth > containerRef.current.clientWidth)
         }
      }
      checkOverflow()
      window.addEventListener('resize', checkOverflow)
      return () => window.removeEventListener('resize', checkOverflow)
   }, [children])

   const handleScroll = () => {
      if (containerRef.current) {
         containerRef.current.scrollTo({
            left: isExpanded ? 0 : containerRef.current.scrollWidth,
            behavior: 'smooth',
         })
         setIsExpanded(!isExpanded)
      }
   }

   return (
      <div className='sm:px-8 md:px-6 lg:px-10'>
         {/* Title + przycisk See All obok siebie */}
         <div className='flex flex-row items-center justify-between gap-y-8 sm:gap-y-6 md:gap-y-5'>
            <Text as='h4' variant='h4mobileMedium' className='text-[var(--color-neutral-900)]'>
               {title}
            </Text>

            {isOverflowing && (
               <Button
                  variant='text'
                  size='L'
                  onClick={handleScroll}
                  className='h-[26px] w-auto gap-x-3.5 px-0 py-0 hover:underline'
               >
                  {isExpanded ? (
                     <>
                        See Less <ArrowLeftIcon className='!h-6 !w-6 stroke-[var(--color-primary-400)]' />
                     </>
                  ) : (
                     <>
                        See All <ArrowRightIcon className='!h-6 !w-6 stroke-[var(--color-primary-400)]' />
                     </>
                  )}
               </Button>
            )}
         </div>

         {/* Lista przewijana */}
         <div
            ref={containerRef}
            className={`flex overflow-hidden scroll-smooth py-3.5 ${gapClassName} ${containerClassName}`}
         >
            {children}
         </div>
      </div>
   )
}

export default ScrollableList
