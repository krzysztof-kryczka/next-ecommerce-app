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
import { Separator } from '@/components/ui/separator'

const ProductPage = ({ params }: { params: Promise<{ id: string }> }) => {
   const [product, setProduct] = useState<any>(null)
   const [quantity, setQuantity] = useState<number>(1)
   const [productId, setProductId] = useState<string | null>(null)
   const [selectedColor, setSelectedColor] = useState<string>('White')
   const [stock, setStock] = useState(0)
   const [categoriesMap, setCategoriesMap] = useState<Record<number, string>>({})
   const [isFullTextVisible, setIsFullTextVisible] = useState(false)
   const [mainImage, setMainImage] = useState<string>('')

   const handleImageClick = (url: string) => {
      setMainImage(url)
   }

   const handleToggleText = () => {
      setIsFullTextVisible(prevState => !prevState)
   }

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
            setMainImage(data.imageUrl[0])
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
      <div className='mx-auto flex max-w-[1440px] flex-col gap-y-8 px-4 pb-10 sm:px-6 md:px-10'>
         {/* Breadcrumb */}
         <Breadcrumb
            paths={[
               { name: 'Products', href: '/products' },
               { name: product.name, href: `/product/${product.id}` },
            ]}
         />

         {/* Siatka zawierająca kolumny */}
         <div className='grid grid-cols-1 gap-x-6 gap-y-8 md:gap-x-8 lg:grid-cols-[2fr_1fr]'>
            {/* Kolumna 1 i 2 - Połączone */}
            <div className='grid grid-cols-1 gap-x-6 gap-y-8 md:gap-x-8 lg:grid-cols-2'>
               {/* Kolumna 1 */}
               <div className='flex flex-col gap-y-6 sm:gap-y-8'>
                  {/* Główne zdjęcie */}
                  <Card className='w-full rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-3'>
                     <CardContent className='px-0'>
                        <img
                           src={mainImage}
                           alt={product?.name || 'Product'}
                           className='h-auto max-w-full rounded-md'
                        />
                     </CardContent>
                  </Card>

                  {/* Miniatury */}
                  <div className='flex gap-x-2 overflow-x-auto sm:gap-x-4'>
                     {product?.imageUrl.map((url: string, index: number) => (
                        <img
                           key={index}
                           src={url}
                           alt={`Thumbnail ${index}`}
                           className={`h-[72px] w-[90px] cursor-pointer rounded-md border-2 sm:h-[99px] sm:w-[130px] ${
                              mainImage === url ? 'border-[var(--color-primary-400)]' : 'border-[var(--color-gray-800)]'
                           }`}
                           onClick={() => handleImageClick(url)}
                        />
                     ))}
                  </div>
               </div>
               {/* Kolumna 2 */}
               <div className='flex w-full flex-col gap-y-6 sm:gap-y-8 md:w-[427px]'>
                  <div className='flex flex-col gap-y-3 sm:gap-y-5'>
                     <h1 className='text-[22px] font-medium text-[var(--color-neutral-900)] sm:text-[28px]'>
                        {product.name}
                     </h1>
                     <Button
                        disabled
                        variant={'fill'}
                        size={'XS'}
                        className='h-auto px-2 py-1 text-xs font-medium disabled:bg-[var(--color-blazeOrange-600)] disabled:text-[var(--color-primary-100)] sm:px-2.5 sm:py-1.5 sm:text-sm'
                     >
                        {categoriesMap[product.categoryId] || 'Unknown'}
                     </Button>
                  </div>
                  <p className='text-[26px] font-medium text-[var(--color-neutral-900)] sm:text-[32px]'>
                     ${product.price}
                  </p>
                  <p className='text-sm text-[var(--color-neutral-900)] sm:text-base'>
                     {isFullTextVisible ? product.description : product.description.slice(0, 50)}{' '}
                     <Button variant='text' className='w-auto px-0 text-xs sm:text-sm' onClick={handleToggleText}>
                        {isFullTextVisible ? 'View less' : 'View more'}
                     </Button>
                  </p>
                  <div className='pb-8 sm:pb-12'>
                     <p className='pb-2 text-sm font-medium text-[var(--color-neutral-300)] sm:pb-3.5 sm:text-lg'>
                        Shipping Available
                     </p>
                     <div className='flex w-full flex-col gap-y-1 rounded-md border p-3 sm:w-[312px] sm:p-4'>
                        <div className='flex items-start gap-2'>
                           <ShieldCrossIcon />
                           <div className='flex flex-col gap-y-1'>
                              <p className='text-sm font-medium text-[var(--color-neutral-900)] sm:text-base'>
                                 NexusHub Courier
                              </p>
                              <p className='text-sm font-medium text-[var(--color-neutral-900)] sm:text-base'>
                                 Estimated arrival{' '}
                                 <span className='font-semibold'>
                                    {product.deliveryDateRange.startDate} - {product.deliveryDateRange.endDate}
                                 </span>
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className='col-span-full'>
                  <Separator className='bg-[var(--color-gray-800)]' />
               </div>
            </div>

            {/* Kolumna 3 */}
            <Card className='w-full rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-4 text-[var(--color-base-white)] sm:max-w-[422px] sm:p-6'>
               <CardContent className='flex flex-col gap-y-6 px-0 sm:gap-y-8'>
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
                  <Button variant='stroke' size='XXL' className='flex w-full items-center gap-2 text-xs sm:text-sm'>
                     Add to Cart
                     <CartIcon className='text-[var(--color-blazeOrange-600)]' />
                  </Button>
               </CardContent>
            </Card>
         </div>
      </div>
   )

}

export default ProductPage
