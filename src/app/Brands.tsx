'use client'

import { useRouter } from 'next/navigation'
import Text from '@/components/ui/text'
import useFetch from '@/hooks/useFetch'
import { Brand } from '@/types/Brand'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import LoadingIndicator from '@/components/ui/LoadingIndicator'
import ErrorMessage from '@/components/ui/ErrorMessage'
import ScrollableList from '@/components/ScrollableList'

const BrandList = () => {
   const { data: brands, loading, error } = useFetch<Brand>('/api/brands', {}, false, true)
   const router = useRouter()

   if (loading) return <LoadingIndicator />
   if (error) return <ErrorMessage sectionName='brands.' errorDetails={error} />

   return (
      <ScrollableList title={'Brand'} containerClassName='justify-start' gapClassName='gap-8'>
         {Array.isArray(brands) && brands.length > 0 ? (
            brands.map(brand => (
               <Card
                  key={brand.id}
                  className='flex h-[190px] w-[220px] cursor-pointer flex-col items-center justify-between rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] px-[69px] py-[43px] shadow-md transition-transform duration-300 hover:scale-110 hover:brightness-150'
                  onClick={() => router.push(`/products?brandId=${brand.id}`)}
               >
                  <CardHeader className='flex h-[46px] w-full items-center justify-center px-0'>
                     <Image
                        width={220}
                        height={190}
                        src={brand.logo}
                        alt={brand.name}
                        className='h-full w-full object-contain'
                     />
                  </CardHeader>
                  <CardContent className='flex w-full items-center justify-center'>
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
      </ScrollableList>
   )
}

export default BrandList
