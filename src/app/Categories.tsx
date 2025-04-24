'use client'

import { JSX, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Category } from '@/types/Category'
import Link from 'next/link'
import MouseIcon from '@/components/icons/MouseIcon'
import KeyboardIcon from '@/components/icons/KeyboardIcon'
import MonitorIcon from '@/components/icons/MonitorIcon'
import WebcamIcon from '@/components/icons/WebcamIcon'
import HeadphoneIcon from '@/components/icons/HeadphoneIcon'

const categoryIcons: Record<string, JSX.Element> = {
   Monitor: <MonitorIcon />,
   Keyboard: <KeyboardIcon />,
   Mouse: <MouseIcon />,
   Webcam: <WebcamIcon />,
   Headphone: <HeadphoneIcon />,
}

const Categories = () => {
   const [categories, setCategories] = useState<Category[]>([])

   useEffect(() => {
      async function fetchCategories() {
         try {
            const response = await fetch('/api/categories')
            if (!response.ok) throw new Error('Failed to fetch categories')
            const data: Category[] = await response.json()
            setCategories(data)
         } catch (error) {
            console.error('Failed to fetch categories:', error)
         }
      }
      fetchCategories()
   }, [])

   return (
      <div className='flex flex-col gap-y-8'>
         <h2 className='text-[var(--color-neutral-900) text-[28px] font-medium'>Category</h2>
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
                     <CardHeader className='flex flex-col items-center gap-0 p-0'>
                        {/* Ikona na podstawie nazwy kategorii */}
                        {categoryIcons[category.name] || <span className='text-gray-500'>No Icon</span>}
                        <CardTitle className='text-[var(--color-neutral-900) text-xl font-medium'>
                           {category.name}
                        </CardTitle>
                     </CardHeader>
                  </Card>
               </Link>
            ))}
         </div>
      </div>
   )
}

export default Categories
