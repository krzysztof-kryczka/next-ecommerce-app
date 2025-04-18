'use client'

import React, { useState, useEffect } from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import { Button } from '@/components/ui/button'
import CartIcon from '@/components/icons/CartIcon'
import { Card, CardContent } from '@/components/ui/card'
import ColorPicker from '@/components/ColorPicker'
import QuantityPicker from '@/components/QuantityPicker'
import Subtotal from '@/components/Subtotal'
import ShieldCrossIcon from '@/components/icons/ShieldCrossIcon'

const ProductPage = ({ params }: { params: Promise<{ id: string }> }) => {
   const [product, setProduct] = useState<any>(null)
   const [quantity, setQuantity] = useState<number>(1)
   const [productId, setProductId] = useState<string | null>(null)

   const [selectedColor, setSelectedColor] = useState<string>('White')

   const [stock, setStock] = useState(0)
   const [categoriesMap, setCategoriesMap] = useState<Record<number, string>>({})

   useEffect(() => {
      const unwrapParams = async () => {
         const unwrappedParams = await params
         setProductId(unwrappedParams.id)
      }

      unwrapParams()
   }, [params])

   useEffect(() => {
      if (productId) {
         const fetchProduct = async () => {
            const res = await fetch(`/api/product/${productId}`)
            const { data } = await res.json()
            setProduct(data)
            setStock(data.stock)
         }

         fetchProduct()
      }
   }, [productId])

   useEffect(() => {
      const fetchCategories = async () => {
         try {
            const res = await fetch('/api/categories')
            if (!res.ok) {
               throw new Error(`HTTP error! status: ${res.status}`)
            }

            const categories = await res.json()

            const categoryMapping = categories.reduce(
               (acc: Record<number, string>, category: { id: number; name: string }) => {
                  acc[category.id] = category.name
                  return acc
               },
               {},
            )

            setCategoriesMap(categoryMapping)
         } catch (error) {
            console.error('Error fetching categories:', error)
         }
      }

      fetchCategories()
   }, [])

   if (!product) {
      return <div className='flex h-screen items-center justify-center'>Ładowanie...</div>
   }

   return (
      <div className='mx-auto max-w-7xl px-4 py-8'>
         <Breadcrumb
            paths={[
               { name: 'Home', href: '/' },
               { name: 'Products', href: '/products' },
               { name: product.name, href: `/product/${product.id}` },
            ]}
         />
         <div className='mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3'>
            {/* Pierwsza kolumna - zdjęcia */}
            <div className='space-y-4'>
               <img src={product.imageUrl[0]} alt={product.name} className='h-auto w-full rounded-lg shadow-md' />
               <div className='flex gap-2'>
                  {product.imageUrl.map((url: string, index: number) => (
                     <img key={index} src={url} alt={`Thumbnail ${index}`} className='h-16 w-16 rounded-lg border' />
                  ))}
               </div>
            </div>

            {/* Druga kolumna - opis produktu */}
            <div>
               <h1 className='text-[28px] font-medium text-[var(--color-neutral-900)]'>{product.name}</h1>
               <Button
                  disabled
                  variant={'fill'}
                  size={'XS'}
                  className='h-auto bg-[var(--color-blazeOrange-600)] px-2.5 py-1.5 text-sm font-medium text-[var(--color-primary-100)]'
               >
                  {categoriesMap[product.categoryId] || 'Unknown'}
               </Button>

               <p className='text-[32px] font-medium text-[var(--color-neutral-900)]'>${product.price}</p>
               <p className='text-base text-[var(--color-neutral-900)]'>
                  {product.description.slice(0, 300)} <button className=''>View more</button>
               </p>
               <p className='text-lg font-medium text-[var(--color-neutral-300)]'>Shipping Available</p>
               <div className='rounded-md border'>
                  <div className='flex'>
                     <ShieldCrossIcon />
                     <span className='text-base font-medium text-[var(--color-neutral-900)]'>NexusHub Courier</span>
                  </div>
                  <p className='text-base font-medium text-[var(--color-neutral-900)]'>
                     Estimated arrival{' '}
                     <span className='font-semibold'>
                        {product.deliveryDateRange.startDate} - {product.deliveryDateRange.endDate}
                     </span>
                  </p>
               </div>
            </div>

            {/* Trzecia kolumna - opcje i koszyk */}
            <Card className='w-full max-w-md rounded-md border-0 bg-[var(--color-base-gray)] p-6 text-[var(--color-base-white)] shadow-lg'>
               <CardContent className='flex flex-col gap-y-8 px-0'>
                  <ColorPicker
                     colors={[
                        { name: 'White', value: 'bg-[var(--color-neutral-900)]' },
                        { name: 'Gray', value: 'bg-[var(--color-gray-800)]' },
                     ]}
                     selectedColor={selectedColor}
                     setSelectedColor={setSelectedColor}
                  />
                  <QuantityPicker quantity={quantity} setQuantity={setQuantity} stock={stock} />
                  <Subtotal quantity={quantity} price={product.price} />
                  <Button variant='stroke' size='XXL' className='w-full'>
                     Add to Cart <CartIcon />
                  </Button>
               </CardContent>
            </Card>
         </div>
      </div>
   )
}

export default ProductPage
