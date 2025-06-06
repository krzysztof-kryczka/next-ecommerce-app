'use client'

import { JSX } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import MouseIcon from '@/components/icons/MouseIcon'
import KeyboardIcon from '@/components/icons/KeyboardIcon'
import MonitorIcon from '@/components/icons/MonitorIcon'
import WebcamIcon from '@/components/icons/WebcamIcon'
import HeadphoneIcon from '@/components/icons/HeadphoneIcon'
import Text from '@/components/ui/text'
import useFetch from '@/hooks/useFetch'
import { Category } from '@/types/Category'
import LoadingIndicator from '@/components/ui/LoadingIndicator'
import ErrorMessage from '@/components/ui/ErrorMessage'

const categoryIcons: Record<string, JSX.Element> = {
   Monitor: <MonitorIcon />,
   Keyboard: <KeyboardIcon />,
   Mouse: <MouseIcon />,
   Webcam: <WebcamIcon />,
   Headphone: <HeadphoneIcon />,
}

const Categories = (): JSX.Element => {
   const { data: categories, loading, error } = useFetch<Category>('/api/categories', {}, false, true)

   if (loading) return <LoadingIndicator />
   if (error) return <ErrorMessage sectionName='categories.' errorDetails={error} />

   return (
      <div className='px-6 sm:px-8 md:px-10'>
         <div>
            <div className='flex flex-col gap-y-6 sm:gap-y-8'>
               <Text as='h4' variant='h4mobileMedium' className='text-[var(--color-neutral-900)]'>
                  Category
               </Text>
               <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
                  {Array.isArray(categories) ? (
                     categories.map(category => (
                        <Link
                           key={category.id}
                           href={{
                              pathname: '/products',
                              query: { 'selected[]': [category.id] },
                           }}
                        >
                           <Card className='w-full cursor-pointer gap-0 border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] px-6 py-6 text-[var(--color-base-white)] transition-transform duration-300 ease-in-out hover:scale-115 hover:shadow-lg hover:brightness-150 sm:max-w-[422px] sm:px-8 sm:py-7 md:px-10 md:py-8 lg:px-[70px] lg:py-7'>
                              <CardHeader className='flex flex-col items-center gap-y-4 p-0 sm:gap-y-5 md:gap-y-6'>
                                 {categoryIcons[category.name] || <span className='text-gray-500'>No Icon</span>}
                                 <CardTitle>
                                    <Text variant='h6mobileMedium' className='text-[var(--color-neutral-900)]'>
                                       {category.name}
                                    </Text>
                                 </CardTitle>
                              </CardHeader>
                           </Card>
                        </Link>
                     ))
                  ) : (
                     <Text as='p' variant='textMregular' className='text-center text-gray-500'>
                        No categories available.
                     </Text>
                  )}
               </div>
            </div>
         </div>
      </div>
   )
}

export default Categories
