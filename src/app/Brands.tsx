'use client'

import { useRouter } from 'next/navigation'
import Text from '@/components/ui/text'
import useFetch from '@/hooks/useFetch'
import { Brand } from '@/types/Brand'
import { toast } from 'react-toastify'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { JSX } from 'react'

const BrandList = (): JSX.Element => {
   const { data: brands, loading, error } = useFetch<Brand>('/api/brands', {}, false, true)
   const router = useRouter()

   if (loading) {
      return (
         <Text as='h4' variant='h4mobileMedium' className='text-center text-[var(--color-neutral-900)]'>
            Loading brands...
         </Text>
      )
   }

   if (error) {
      toast.error('Failed to fetch brands. Please try again later.')
   }

   return (
      <div className='px-10'>
         <div className='flex flex-col gap-y-8'>
            <Text as='h4' variant='h4mobileMedium' className='text-[var(--color-neutral-900)]'>
               Brands
            </Text>

            <div className='flex justify-center gap-x-8'>
               {Array.isArray(brands) ? (
                  brands.map(brand => (
                     <Card
                        key={brand.id}
                        className='flex h-[190px] w-[220px] cursor-pointer flex-col items-center justify-center gap-7 rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] py-[43px] shadow-md transition-transform duration-300 hover:scale-105'
                        onClick={() => router.push(`/products?brandId=${brand.id}`)}
                     >
                        <CardHeader className='flex w-full flex-col items-center justify-center'>
                           <Image
                              width={198}
                              height={46}
                              src={brand.logo}
                              alt={brand.name}
                              className='h-[46px] w-auto object-contain'
                           />
                        </CardHeader>
                        <CardContent className='px-0 text-center'>
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
      </div>
   )
}

export default BrandList
