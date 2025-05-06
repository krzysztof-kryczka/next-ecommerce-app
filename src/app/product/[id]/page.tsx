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
import { useAddToCart } from '@/hooks/useAddToCart'
import Text from '@/components/ui/text'
import useFetch from '@/hooks/useFetch'
import { useCategories } from '@/context/CategoriesContext'
import { useCurrency } from '@/context/CurrencyContext'
import { Product } from '@/types/Product'

const ProductPage = ({ params }: { params: Promise<{ id: string }> }) => {
   const [quantity, setQuantity] = useState<number>(1)
   const [productId, setProductId] = useState<string | null>(null)
   const [selectedColor, setSelectedColor] = useState<string>('White')
   const [stock, setStock] = useState(0)
   const [isFullTextVisible, setIsFullTextVisible] = useState(false)
   const [mainImage, setMainImage] = useState<string>('')
   const { addToCart, loading } = useAddToCart()
   const { categoriesMap } = useCategories()
   const { currency, convertCurrency, currencySymbols } = useCurrency()

   const {
      data: productData,
      loading: productLoading,
      error,
   } = useFetch<{ success: boolean; data: Product }>(
      productId ? `/api/product/${productId}` : null,
      {},
      !productId,
      false,
   )

   const product = Array.isArray(productData) ? null : productData?.data

   const handleImageClick = (url: string) => {
      setMainImage(url)
   }

   const handleToggleText = () => {
      setIsFullTextVisible(prevState => !prevState)
   }

   useEffect(() => {
      const unwrapParams = async () => {
         const unwrappedParams = await params
         console.log('productId form parameters:', unwrappedParams.id)
         setProductId(unwrappedParams.id)
      }
      unwrapParams()
   }, [params])

   useEffect(() => {
      console.log('Details product:', product)
      if (product) {
         setStock(product.stock)
         setMainImage(product.imageUrl[0])
      }
   }, [product])

   const handleAddToCart = () => {
      if (product) {
         addToCart(product.id, quantity)
      }
   }

   if (productLoading) {
      return <div className='flex h-screen items-center justify-center'>Loading...</div>
   }

   if (!product || error) {
      return (
         <div className='flex h-screen items-center justify-center text-[var(--color-danger-50)]'>
            ⚠️ Product not exists! ({error})
         </div>
      )
   }

   return (
      <div className='flex flex-col gap-y-8 px-10 pb-10 sm:px-6 md:px-10'>
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
                  <Card className='h-[341px] w-[422px] rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-3'>
                     <CardContent className='px-0'>
                        {mainImage ? (
                           <img
                              src={mainImage}
                              alt={product.name || 'Product'}
                              className='h-[317px] w-[398px] rounded-md'
                           />
                        ) : null}
                     </CardContent>
                  </Card>

                  {/* Miniatury */}
                  <div className='flex gap-x-2 overflow-x-auto sm:gap-x-4'>
                     {product.imageUrl?.map((url: string, index: number) =>
                        url ? (
                           <img
                              key={index}
                              src={url}
                              alt={`Thumbnail ${index}`}
                              className={`h-[72px] w-[90px] cursor-pointer rounded-md border-2 sm:h-[99px] sm:w-[130px] ${
                                 mainImage === url
                                    ? 'border-[var(--color-primary-400)]'
                                    : 'border-[var(--color-gray-800)]'
                              }`}
                              onClick={() => handleImageClick(url)}
                           />
                        ) : null,
                     )}
                  </div>
               </div>
               {/* Kolumna 2 */}
               <div className='flex w-full flex-col gap-y-6 sm:gap-y-8 md:w-[427px]'>
                  <div className='flex flex-col gap-y-3 sm:gap-y-5'>
                     <Text as='h1' variant='h5medium' className='text-[var(--color-neutral-900)]'>
                        {product.name}
                     </Text>
                     <Button
                        disabled
                        variant={'fill'}
                        size={'XS'}
                        className='h-auto px-2 py-1 text-xs font-medium disabled:bg-[var(--color-blazeOrange-600)] disabled:text-[var(--color-primary-100)] sm:px-2.5 sm:py-1.5 sm:text-sm'
                     >
                        {categoriesMap[product.categoryId] || 'Unknown'}
                     </Button>
                  </div>
                  <Text as='p' variant='h4medium' className='text-[var(--color-neutral-900)]'>
                     {currencySymbols[currency] || currency}{' '}
                     {convertCurrency(product.price.toString(), 'USD', currency)}
                  </Text>
                  <Text as='p' variant='textMregular' className='text-[var(--color-neutral-900)]'>
                     {isFullTextVisible ? product.description : product.description?.slice(0, 50)}{' '}
                     <Button
                        variant='text'
                        className='w-auto px-0 text-base leading-[26px] font-medium tracking-normal'
                        onClick={handleToggleText}
                     >
                        {isFullTextVisible ? 'View less' : 'View more'}
                     </Button>
                  </Text>

                  <div className='flex flex-col gap-y-3.5'>
                     <Text as='p' variant='textLmedium' className='text-[var(--color-neutral-300)]'>
                        Shipping Available
                     </Text>
                     <div className='flex w-full flex-col gap-y-1 rounded-md border p-3 sm:w-[312px] sm:p-4'>
                        <div className='flex items-start gap-2'>
                           <ShieldCrossIcon />
                           <div className='flex flex-col gap-y-1'>
                              <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-900)]'>
                                 NexusHub Courier
                              </Text>
                              <Text as='p' variant='textMregular' className='text-[var(--color-neutral-900)]'>
                                 Estimated arrival{' '}
                                 <span className='font-semibold'>
                                    {product.deliveryDateRange.startDate} - {product.deliveryDateRange.endDate}
                                 </span>
                              </Text>
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
            <Card className='max-h-[470px] w-full rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-4 text-[var(--color-base-white)] sm:max-w-[422px] sm:p-6'>
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
                  <Button
                     variant='stroke'
                     size='XXL'
                     className='flex h-[54px] w-full items-center gap-2 text-xs sm:text-sm'
                     onClick={handleAddToCart}
                     disabled={loading}
                  >
                     <Text as='span' variant='textMmedium'>
                        {loading ? 'Adding...' : 'Add to Cart'}
                     </Text>
                     <CartIcon className='!h-6 !w-6 text-[var(--color-blazeOrange-600)]' />
                  </Button>
               </CardContent>
            </Card>
         </div>
      </div>
   )
}

export default ProductPage
