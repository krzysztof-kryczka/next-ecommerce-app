'use client'

import { useRouter } from 'next/navigation'
import Text from '@/components/ui/text'
import useFetch from '@/hooks/useFetch'
import { Brand } from '@/types/Brand'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { JSX } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import LoadingIndicator from '@/components/ui/LoadingIndicator'
import ErrorMessage from '@/components/ui/ErrorMessage'

const BrandList = (): JSX.Element => {
   const { data: brands, loading, error } = useFetch<Brand>('/api/brands', {}, false, true)
   const router = useRouter()

   if (loading) return <LoadingIndicator />
   if (error) return <ErrorMessage sectionName='brands.' errorDetails={error} />

   return (
      <div className='sm:px-8 md:px-6 lg:px-10'>
         <div className='flex flex-col gap-y-8 sm:gap-y-6 md:gap-y-5'>
            <Text as='h4' variant='h4mobileMedium' className='text-[var(--color-neutral-900)]'>
               Brands
            </Text>

            <Carousel className='w-full'>
               <CarouselContent className='flex gap-x-8'>
                  {Array.isArray(brands) ? (
                     brands.map(brand => (
                        <CarouselItem
                           key={brand.id}
                           className='xs:basis-[40%] flex-shrink-0 py-5 sm:max-w-[160px] sm:basis-[32%] md:max-w-[180px] md:basis-[24%] lg:max-w-[220px] lg:basis-[18%] xl:basis-[16%]'
                        >
                           <Card
                              className='flex cursor-pointer flex-col items-center justify-center gap-7 rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] px-0 py-[43px] shadow-md transition-transform duration-300 hover:scale-110 sm:h-[180px] sm:w-[160px] sm:gap-6 sm:py-[38px] md:h-[170px] md:w-[180px] md:gap-5 md:py-[35px] lg:h-[190px] lg:w-[220px]'
                              onClick={() => router.push(`/products?brandId=${brand.id}`)}
                           >
                              <CardHeader className='flex w-full flex-col items-center justify-center'>
                                 <Image
                                    width={198}
                                    height={46}
                                    src={brand.logo}
                                    alt={brand.name}
                                    className='h-[46px] w-auto object-contain sm:h-[40px] sm:w-[140px] md:h-[36px] md:w-[160px]'
                                 />
                              </CardHeader>
                              <CardContent className='px-0 text-center'>
                                 <Text as='h6' variant='h6mobileMedium' className='text-[var(--color-neutral-900)]'>
                                    {brand.name}
                                 </Text>
                              </CardContent>
                           </Card>
                        </CarouselItem>
                     ))
                  ) : (
                     <Text as='p' variant='textMregular' className='text-center text-gray-500'>
                        No brands available.
                     </Text>
                  )}
               </CarouselContent>
               <CarouselPrevious className='absolute top-1/2 -left-15 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-gray-300 shadow hover:bg-gray-400 focus:outline-none' />
               <CarouselNext className='absolute top-1/2 -right-15 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-gray-300 shadow hover:bg-gray-400 focus:outline-none' />
            </Carousel>
         </div>
      </div>
   )
}

export default BrandList
