'use client'

import { JSX, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import CartIcon from '@/components/icons/CartIcon'
import { ProductCardProps } from '@/types/ProductCardProps'
import { useCategories } from '@/context/CategoriesContext'
import Text from '@/components/ui/text'
import { useAddToCart } from '@/hooks/useAddToCart'
import { useCurrency } from '@/context/CurrencyContext'
import Image from 'next/image'

const ProductCard = ({ product }: ProductCardProps): JSX.Element => {
   const { categoriesMap } = useCategories()
   const { addToCart } = useAddToCart()
   const { currency, convertCurrency, currencySymbols } = useCurrency()

   const handleAddToCart = useCallback(() => {
      const firstVariant = product.variants[0]
      addToCart(product.id, 1, firstVariant.id)
   }, [product?.id, addToCart])

   return (
      <div className='xs:h-[320px] xs:w-[250px] relative z-10 cursor-pointer overflow-hidden rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] transition-transform duration-300 hover:z-20 hover:scale-105 hover:brightness-75 sm:h-[340px] sm:w-[270px] md:h-[360px] md:w-[290px] lg:h-[386px] lg:w-[300px]'>
         <div
            onClick={handleAddToCart}
            className='absolute top-8 left-8 z-10 flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-base-gray)] hover:bg-[var(--color-blazeOrange-600)]'
         >
            <CartIcon />
         </div>
         <Link href={`/product/${product?.id}`}>
            <div className='px-4 pt-4'>
               <Image
                  src={product?.imageUrl?.[0] || 'https://i.ibb.co/xtWHYY7v/brak-zdjecia.png'}
                  alt={product?.name}
                  height={204}
                  width={268}
                  priority
                  className='xs:h-[160px] xs:w-[210px] rounded-md border border-[var(--color-neutral-900)] object-cover sm:h-[180px] sm:w-[230px] md:h-[200px] md:w-[250px] lg:h-[204px] lg:w-[268px]'
               />
            </div>
            <div className='flex flex-col gap-y-4 px-4 pt-[18px] pb-5'>
               <Button
                  variant='fill'
                  size='XS'
                  className='h-auto w-max bg-[var(--color-blazeOrange-600)] px-2.5 py-1.5 text-[var(--color-primary-100)]'
               >
                  <Text variant='textSmedium'>{categoriesMap[product?.categoryId]}</Text>
               </Button>
               <div className='flex flex-col gap-y-2'>
                  <Text as='h2' variant='textLregular' className='text-[var(--color-neutral-900)]'>
                     {product?.name}
                  </Text>
                  <Text
                     as='h5'
                     variant='h5semiBold'
                     className='flex items-center gap-2 text-[var(--color-neutral-900)]'
                  >
                     {currencySymbols[currency] || currency}{' '}
                     {convertCurrency(product?.price.toString(), 'USD', currency)}
                  </Text>
               </div>
            </div>
         </Link>
      </div>
   )
}

export default ProductCard
