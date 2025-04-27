'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import CartIcon from '@/components/icons/CartIcon'
import { ProductCardProps } from '@/types/ProductCardProps'
import { useCategories } from '@/context/CategoriesContext'
import Text from '@/components/ui/text'
import { useAddToCart } from '@/hooks/useAddToCart'

export default function ProductCard({ product }: ProductCardProps) {
   const { categoriesMap } = useCategories()
   const { addToCart } = useAddToCart()

   const handleAddToCart = () => {
      addToCart(product.id, 1)
   }

   return (
      <div className='relative z-10 h-[386px] w-[300px] cursor-pointer overflow-hidden rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)]'>
         <div
            onClick={handleAddToCart}
            className='absolute top-8 left-8 z-10 flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-base-gray)] hover:bg-[var(--color-blazeOrange-600)]'
         >
            <CartIcon />
         </div>
         <Link key={product.id} href={`/product/${product.id}`}>
            <div className='px-4 pt-4'>
               <img
                  src={product.imageUrl?.[0] || 'https://i.ibb.co/xtWHYY7v/brak-zdjecia.png'}
                  alt={product.name}
                  className='h-[204px] rounded-md object-cover'
               />
            </div>
            <div className='flex flex-col gap-y-4 px-4 pt-[18px] pb-5'>
               <Button
                  variant={'fill'}
                  size={'XS'}
                  className='h-auto w-max bg-[var(--color-blazeOrange-600)] px-2.5 py-1.5 text-[var(--color-primary-100)]'
               >
                  <Text variant='textSmedium'>{categoriesMap[product.categoryId]}</Text>
               </Button>
               <div className='flex flex-col gap-y-2'>
                  <Text as='h2' variant='textLregular' className='text-[var(--color-neutral-900)]'>
                     {product.name}
                  </Text>
                  <Text as='h5' variant='h5semiBold' className='text-[var(--color-neutral-900)]'>
                     ${product.price}
                  </Text>
               </div>
            </div>
         </Link>
      </div>
   )
}
