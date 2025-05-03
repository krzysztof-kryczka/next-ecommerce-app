'use client'

import ProductCard from '@/components/ProductCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import Text from '@/components/ui/text'
import useFetch from '@/hooks/useFetch'
import { ProductCardProps } from '@/types/ProductCardProps'
import { toast } from 'react-toastify'

export default function Recommendations() {
   const { data: recommendations, loading, error } = useFetch<ProductCardProps>('/api/recommendations', {}, false, true)

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
   console.log(recommendations)
   return (
      <div className='px-10'>
         <div className='flex flex-col gap-y-8'>
            <Text as='h4' variant='h4mobileMedium' className='text-[var(--color-neutral-900)]'>
               Recomendation
            </Text>

            <Carousel className='w-full'>
               <CarouselContent className='m-0 flex gap-x-8'>
                  {recommendations.map(product => (
                     <CarouselItem key={product.id} className='basis-[22%] p-0'>
                        <ProductCard product={product} />
                     </CarouselItem>
                  ))}
               </CarouselContent>
               <CarouselPrevious className='absolute top-1/2 -left-15 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-gray-300 shadow hover:bg-gray-400 focus:outline-none' />
               <CarouselNext className='absolute top-1/2 -right-15 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-gray-300 shadow hover:bg-gray-400 focus:outline-none' />
            </Carousel>
         </div>
      </div>
   )
}
