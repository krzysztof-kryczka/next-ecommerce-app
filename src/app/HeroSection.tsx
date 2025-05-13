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
import Image from 'next/image'
import LoadingIndicator from '@/components/ui/LoadingIndicator'
import ErrorMessage from '@/components/ui/ErrorMessage'

export default function CategoriesCarousel() {
   const [carouselApi, setCarouselApi] = useState<CarouselApi>()
   const [currentIndex, setCurrentIndex] = useState(0)
   const { data: categories, loading, error } = useFetch<Category>('/api/categories', {}, false, true)
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

   if (loading) return <LoadingIndicator />
   if (error) return <ErrorMessage sectionName='categories.' errorDetails={error} />

   return (
      <div className='px-10'>
         <div>
            <Card className='gap-0 border-[var(--color-gray-800)] p-0'>
               <CardContent className='relative overflow-hidden p-0'>
                  <Carousel setApi={setCarouselApi} className='relative'>
                     <CarouselContent>
                        {Array.isArray(categories)
                           ? categories.map(category => {
                                return (
                                   <CarouselItem
                                      key={category.id}
                                      className='flex flex-col-reverse items-center justify-between gap-6 p-0 sm:flex-row sm:gap-8'
                                   >
                                      {/* Lewa strona: Tekst */}
                                      <div className='flex w-full flex-col gap-y-6 px-6 pt-10 pb-10 text-center sm:w-1/2 sm:gap-y-10 sm:pt-[132px] sm:pb-20 sm:pl-[120px] sm:text-left'>
                                         <div className='flex flex-col gap-y-6'>
                                            <Text
                                               as='h4'
                                               variant='h4medium'
                                               className='text-[var(--color-neutral-900)]'
                                            >
                                               {category.name}
                                            </Text>
                                            <Text
                                               as='p'
                                               variant='textMregular'
                                               className='text-[var(--color-neutral-100)]'
                                            >
                                               {category.description}
                                            </Text>
                                         </div>
                                         <Button
                                            variant='stroke'
                                            size='XL'
                                            onClick={() => handleExploreCategory(category.id)}
                                            className='mx-auto w-full gap-x-3.5 pr-[15px] hover:bg-[var(--color-primary-600)] hover:text-white sm:mx-0 sm:w-[211px]'
                                         >
                                            <Text variant='textMmedium'>Explore Category</Text>
                                            <ArrowRightIcon className='!h-6 !w-6 stroke-[var(--color-primary-400)]' />
                                         </Button>
                                      </div>

                                      {/* Prawa strona: Obraz */}
                                      <div className='flex w-full justify-center sm:w-1/2'>
                                         {category.image ? (
                                            <Image
                                               src={category.image}
                                               alt={category.name}
                                               width={384}
                                               height={384}
                                               className='mx-auto h-96 w-auto transform border-none sm:max-w-[200px] sm:scale-100 md:max-w-[250px] md:scale-125 lg:max-w-[384px] lg:scale-150'
                                            />
                                         ) : (
                                            <div className='flex h-40 w-full items-center justify-center bg-[var(--color-danger-50)] sm:h-96 sm:w-96'>
                                               <Text as='span' variant='textMmedium'>
                                                  No Image
                                               </Text>
                                            </div>
                                         )}
                                      </div>
                                   </CarouselItem>
                                )
                             })
                           : null}
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
               {Array.isArray(categories)
                  ? categories.map((_, index) => (
                       <div
                          key={index}
                          className={`h-3 w-3 rounded-full ${index === currentIndex ? 'bg-[var(--color-primary-400)]' : 'bg-gray-600'}`}
                       />
                    ))
                  : null}
            </div>
         </div>
      </div>
   )
}
