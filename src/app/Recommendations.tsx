'use client'

import ProductCard from '@/components/ProductCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import Text from '@/components/ui/text'
import useFetch from '@/hooks/useFetch'
import { Product } from '@/types/Product'
import { JSX } from 'react'
import { toast } from 'react-toastify'

const Recommendations = (): JSX.Element => {
   const {
      data: response,
      loading,
      error,
   } = useFetch<{ success: boolean; data: Product[] }>('/api/recommendations', {}, false, false)

   const recommendations = response && 'data' in response ? response.data : []

   if (loading) {
      return (
         <Text as='h4' variant='h4mobileMedium' className='text-center text-[var(--color-neutral-900)]'>
            Loading recommendations...
         </Text>
      )
   }

   if (error) {
      toast.error('Failed to fetch recommendations. Please try again later.')
   }

   return (
      <div className='px-10'>
         <div className='flex flex-col gap-y-8'>
            <Text as='h4' variant='h4mobileMedium' className='text-[var(--color-neutral-900)]'>
               Recomendation
            </Text>

            <Carousel className='w-full'>
               <CarouselContent className='flex gap-x-10'>
                  {Array.isArray(recommendations) ? (
                     recommendations.map(product => (
                        <CarouselItem
                           key={product.id}
                           className='xs:basis-[50%] flex-shrink-0 sm:basis-[42%] md:basis-[34%] lg:basis-[26%] xl:basis-[20%]'
                        >
                           <ProductCard product={product} />
                        </CarouselItem>
                     ))
                  ) : (
                     <Text as='p' variant='textMregular' className='text-center text-gray-500'>
                        No products available.
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

export default Recommendations
