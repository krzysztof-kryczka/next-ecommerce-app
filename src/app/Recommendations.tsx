'use client'

import ProductCard from '@/components/ProductCard'
import ErrorMessage from '@/components/ui/ErrorMessage'
import LoadingIndicator from '@/components/ui/LoadingIndicator'
import Text from '@/components/ui/text'
import useFetch from '@/hooks/useFetch'
import { Product } from '@/types/Product'
import ScrollableList from '@/components/ScrollableList'
import { JSX } from 'react'

const Recommendations = (): JSX.Element => {
   const {
      data: response,
      loading,
      error,
   } = useFetch<{ success: boolean; data: Product[] }>('/api/recommendations', {}, false, false)

   const recommendations = response && 'data' in response ? response.data : []

   if (loading) return <LoadingIndicator />
   if (error) return <ErrorMessage sectionName='recommendations.' errorDetails={error} />

   return (
      <ScrollableList title={'Recommendation'} containerClassName='justify-start' gapClassName='gap-7'>
         {Array.isArray(recommendations) ? (
            recommendations.map(product => (
               <div
                  key={product.id}
                  className='h-[386px] w-[300px] flex-shrink-0 gap-7 '
               >
                  <ProductCard key={product.id} product={product} />
               </div>
            ))
         ) : (
            <Text as='p' variant='textMregular' className='text-center text-gray-500'>
               No products available.
            </Text>
         )}
      </ScrollableList>
   )
}

export default Recommendations
