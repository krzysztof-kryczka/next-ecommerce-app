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

const categoryIcons: Record<string, JSX.Element> = {
   Monitor: <MonitorIcon />,
   Keyboard: <KeyboardIcon />,
   Mouse: <MouseIcon />,
   Webcam: <WebcamIcon />,
   Headphone: <HeadphoneIcon />,
}

const Categories = () => {
   const { data: categories, loading, error } = useFetch<Category>('/api/categories')
   if (loading) return <p>Loading categories...</p>
   if (error) return <p>{error}</p>
   return (
      <div className='px-10'>
         <div>
            <div className='flex flex-col gap-y-8'>
               <Text as='h4' variant='h4mobileMedium' className='text-[var(--color-neutral-900)]'>
                  Category
               </Text>
               <div className='grid grid-cols-1 gap-x-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
                  {categories.map(category => (
                     <Link
                        key={category.id}
                        href={{
                           pathname: '/products',
                           query: { 'selected[]': [category.id] },
                        }}
                     >
                        <Card className='w-full cursor-pointer gap-0 rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] px-[70px] py-7 text-[var(--color-base-white)] hover:shadow-lg sm:max-w-[422px]'>
                           <CardHeader className='flex flex-col items-center gap-y-6 p-0'>
                              {/* Ikona na podstawie nazwy kategorii */}
                              {categoryIcons[category.name] || <span className='text-gray-500'>No Icon</span>}
                              <CardTitle>
                                 <Text variant='h6mobileMedium' className='text-[var(--color-neutral-900)'>
                                    {category.name}
                                 </Text>
                              </CardTitle>
                           </CardHeader>
                        </Card>
                     </Link>
                  ))}
               </div>
            </div>
         </div>
      </div>
   )
}

export default Categories
