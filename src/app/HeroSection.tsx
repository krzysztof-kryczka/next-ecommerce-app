'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
   type CarouselApi,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Text from '@/components/ui/text'
import useFetch from '@/hooks/useFetch'
import { Category } from '@/types/Category'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon'

export default function CategoriesCarousel() {
   const [carouselApi, setCarouselApi] = useState<CarouselApi>()
   const [currentIndex, setCurrentIndex] = useState(0)
   const { data: categories, loading, error } = useFetch<Category>('/api/categories')
   const router = useRouter()

   useEffect(() => {
      if (carouselApi) {
         const updateCurrentIndex = () => {
            setCurrentIndex(carouselApi.selectedScrollSnap())
         }

         updateCurrentIndex()
         carouselApi.on('select', updateCurrentIndex)

         return () => {
            carouselApi.off('select', updateCurrentIndex)
         }
      }
   }, [carouselApi])

   const handleExploreCategory = (categoryId: number) => {
      router.push(`/products?selected[]=${categoryId}`)
   }

   if (loading) {
      return <p>Loading categories...</p>
   }

   if (error) {
      return <p>{error}</p>
   }

   return (
      <div className='px-10'>
         <div>
            <Card className='gap-0 border-[var(--color-gray-800)] p-0'>
               <CardContent className='relative overflow-hidden p-0'>
                  <Carousel setApi={setCarouselApi} className='relative'>
                     <CarouselContent>
                        {categories.map(category => (
                           <CarouselItem key={category.id} className='flex items-center justify-between gap-8 p-0'>
                              {/* Lewa strona: Tekst */}
                              <div className='flex w-1/2 flex-col gap-y-10 pt-[132px] pb-20 pl-[120px]'>
                                 <div className='flex flex-col gap-y-6'>
                                    <Text as='h4' variant='h4medium' className='text-[var(--color-neutral-900)]'>
                                       {category.name}
                                    </Text>
                                    <Text as='p' variant='textMregular' className='text-[var(--color-neutral-100)]'>
                                       {category.description}
                                    </Text>
                                 </div>
                                 <Button
                                    variant='stroke'
                                    size='XL'
                                    onClick={() => handleExploreCategory(category.id)}
                                    className='w-[211px] gap-x-3.5 pr-[15px]'
                                 >
                                    <Text variant='textMmedium'>Explore Category</Text>
                                    <ArrowRightIcon className='!h-6 !w-6 stroke-[var(--color-primary-400)]' />
                                 </Button>
                              </div>
                              {/* Prawa strona: Obraz */}
                              <div className='w-1/2'>
                                 <img
                                    src={category.image}
                                    alt={category.name}
                                    className='mx-auto h-96 w-auto scale-[180%] transform border-none'
                                 />
                              </div>
                           </CarouselItem>
                        ))}
                     </CarouselContent>
                     {/* Nawigacja */}
                     <CarouselPrevious
                        onClick={() => carouselApi?.scrollPrev()}
                        className='absolute top-1/2 left-0 h-[74px] w-11 -translate-y-1/2 transform cursor-pointer rounded-none rounded-tr-md rounded-br-md bg-[var(--color-primary-400)] text-[var(--color-base-gray)] hover:bg-gray-600'
                     ></CarouselPrevious>
                     <CarouselNext
                        onClick={() => carouselApi?.scrollNext()}
                        className='absolute top-1/2 right-0 h-[74px] w-11 -translate-y-1/2 transform cursor-pointer rounded-none rounded-tl-md rounded-bl-md bg-[var(--color-primary-400)] text-[var(--color-base-gray)] hover:bg-gray-600'
                     ></CarouselNext>
                  </Carousel>
               </CardContent>
            </Card>
            {/* Indykatory */}
            <div className='mt-6 flex justify-center gap-x-4'>
               {categories.map((_, index) => (
                  <div
                     key={index}
                     className={`h-3 w-3 rounded-full ${index === currentIndex ? 'bg-[var(--color-primary-400)]' : 'bg-gray-600'}`}
                  />
               ))}
            </div>
         </div>
      </div>
   )
}
