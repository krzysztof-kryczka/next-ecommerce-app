'use client'

import { useState, useEffect, useRef, JSX } from 'react'
import { useRouter } from 'next/navigation'
import Text from '@/components/ui/text'
import useFetch from '@/hooks/useFetch'
import { Brand } from '@/types/Brand'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import LoadingIndicator from '@/components/ui/LoadingIndicator'
import ErrorMessage from '@/components/ui/ErrorMessage'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon'

const BrandList = (): JSX.Element => {
   const { data: brands, loading, error } = useFetch<Brand>('/api/brands', {}, false, true)
   const router = useRouter()
   const [isExpanded, setIsExpanded] = useState(false)
   const [isOverflowing, setIsOverflowing] = useState(false)
   const containerRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
      const checkOverflow = () => {
         if (containerRef.current) {
            const isOverflow = containerRef.current.scrollWidth > containerRef.current.clientWidth
            setIsOverflowing(isOverflow)
         }
      }

      checkOverflow()
      window.addEventListener('resize', checkOverflow)
      return () => window.removeEventListener('resize', checkOverflow)
   }, [brands]

   const handleScroll = () => {
      if (containerRef.current) {
         containerRef.current.scrollTo({
            left: isExpanded ? 0 : containerRef.current.scrollWidth,
            behavior: 'smooth',
         })
         setIsExpanded(!isExpanded)
      }
   }

   if (loading) return <LoadingIndicator />
   if (error) return <ErrorMessage sectionName='brands.' errorDetails={error} />

   return (
      <div className='sm:px-8 md:px-6 lg:px-10'>
         <div className='flex flex-row items-center justify-between gap-y-8 sm:gap-y-6 md:gap-y-5'>
            <Text as='h4' variant='h4mobileMedium' className='text-[var(--color-neutral-900)]'>
               Brand
            </Text>
            {isOverflowing && (
               <button
                  onClick={handleScroll}
                  className='flex items-center gap-x-2 text-sm font-semibold text-[var(--color-primary-400)] hover:underline'
               >
                  {isExpanded ? (
                     <>
                        See Less <ArrowLeftIcon className='h-6 w-6 stroke-[var(--color-primary-400)]' />
                     </>
                  ) : (
                     <>
                        See All <ArrowRightIcon className='h-6 w-6 stroke-[var(--color-primary-400)]' />
                     </>
                  )}
               </button>
            )}
         </div>

         <div ref={containerRef} className='flex gap-8 overflow-hidden scroll-smooth py-4'>
            {Array.isArray(brands) ? (
               brands.map(brand => (
                  <Card
                     key={brand.id}
                     className='flex h-[190px] w-[220px] cursor-pointer flex-col items-center justify-between rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] px-[69px] py-[43px] shadow-md transition-transform duration-300 hover:scale-110'
                     onClick={() => router.push(`/products?brandId=${brand.id}`)}
                  >
                     <CardHeader className='flex h-[46px] w-full items-center justify-center'>
                        <Image
                           width={220}
                           height={190}
                           src={brand.logo}
                           alt={brand.name}
                           className='h-full w-full object-contain'
                        />
                     </CardHeader>
                     <CardContent className='mt-4 flex w-full items-center justify-center'>
                        <Text as='h6' variant='h6mobileMedium' className='text-[var(--color-neutral-900)]'>
                           {brand.name}
                        </Text>
                     </CardContent>
                  </Card>
               ))
            ) : (
               <Text as='p' variant='textMregular' className='text-center text-gray-500'>
                  No brands available.
               </Text>
            )}
         </div>
      </div>
   )
}

export default BrandList
