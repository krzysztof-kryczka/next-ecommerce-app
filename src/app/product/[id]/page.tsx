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
import Image from 'next/image'
import ErrorMessage from '@/components/ui/ErrorMessage'
import LoadingIndicator from '@/components/ui/LoadingIndicator'
import { toast } from 'react-toastify'

const ProductPage = ({ params }: { params: Promise<{ id: string }> }) => {
   const [quantity, setQuantity] = useState<number>(1)
   const [productId, setProductId] = useState<string | null>(null)
   const [selectedColor, setSelectedColor] = useState<string>('')
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
         // console.log('productId form parameters:', unwrappedParams.id)
         setProductId(unwrappedParams.id)
      }
      unwrapParams()
   }, [params])

   useEffect(() => {
      if (product && product.variants?.length > 0 && selectedColor === '') {
         setSelectedColor(product.variants[0].color)
      }
   }, [product]) // tylko przy pierwszym wczytaniu produktu ustawiamy domyślny kolor

   useEffect(() => {
      if (product) {
         setStock(product.variants?.find(v => v.color === selectedColor)?.stock || 0)
         setQuantity(prevQuantity =>
            Math.min(prevQuantity, product.variants?.find(v => v.color === selectedColor)?.stock || 1),
         )
         setMainImage(product.imageUrl[0])
      }
   }, [product, selectedColor])

   const handleAddToCart = () => {
      if (product) {
         // console.log('Product Variants:', product.variants)
         // console.log('Selected Color:', selectedColor)
         const selectedVariant = product.variants?.find(v => v.color === selectedColor)
         if (!selectedVariant) {
            toast.error('Invalid product variant selected.')
            return
         }
         console.log('selectedVariant', selectedVariant)
         addToCart(product.id, quantity, selectedVariant.id)
      }
   }

   if (productLoading) return <LoadingIndicator />

   if (!product || error) {
      return <ErrorMessage sectionName='product.' errorDetails={error} />
   }

   return (
      <div className='flex flex-col gap-y-6 px-6 pb-6 sm:px-6 md:px-8 lg:px-10'>
         {/* Breadcrumb */}
         <Breadcrumb
            paths={[
               { name: 'Products', href: '/products' },
               { name: product.name, href: `/product/${product.id}` },
            ]}
         />

         {/* Siatka zawierająca kolumny */}
         <div className='grid grid-cols-1 gap-x-4 gap-y-6 md:gap-x-6 md:gap-y-8 xl:grid-cols-[2fr_1fr]'>
            {/* Kolumna 1 i 2 - Połączone */}
            <div className='grid grid-cols-1 gap-x-4 gap-y-6 md:gap-x-6 lg:grid-cols-2'>
               {/* Kolumna 1 */}
               <div className='flex flex-col gap-y-5 sm:gap-y-6 md:gap-y-7'>
                  {/* Główne zdjęcie */}
                  <Card className='h-[260px] w-full rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-2 sm:h-[300px] sm:w-[320px] md:h-[330px] md:w-[380px] lg:h-[341px] lg:w-[422px]'>
                     <CardContent className='px-0'>
                        {mainImage ? (
                           <Image
                              height={317}
                              width={398}
                              src={mainImage}
                              alt={product.name || 'Product'}
                              className='h-[230px] w-full rounded-md sm:h-[280px] sm:w-[300px] md:h-[310px] md:w-[370px] lg:h-[317px] lg:w-[398px]'
                           />
                        ) : null}
                     </CardContent>
                  </Card>

                  {/* Miniatury */}
                  <div className='flex gap-x-2 overflow-x-auto sm:gap-x-4 md:gap-x-5'>
                     {product.imageUrl?.map((url: string, index: number) =>
                        url ? (
                           <Image
                              key={index}
                              src={url}
                              alt={`Thumbnail ${index}`}
                              width={70}
                              height={56}
                              className={`h-[56px] w-[70px] cursor-pointer rounded-md border-2 sm:h-[80px] sm:w-[110px] md:h-[90px] md:w-[120px] lg:h-[99px] lg:w-[130px] ${
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
               <div className='flex w-full flex-col gap-y-6 sm:gap-y-8 md:gap-y-7'>
                  <div className='flex flex-col gap-y-2 sm:gap-y-4 md:gap-y-3'>
                     <Text as='h1' variant='h5medium' className='text-[var(--color-neutral-900)]'>
                        {product.name}
                     </Text>
                     <Button
                        disabled
                        variant={'fill'}
                        size={'XS'}
                        className='h-auto px-2 py-1 text-xs font-medium disabled:bg-[var(--color-blazeOrange-600)] disabled:text-[var(--color-primary-100)] sm:px-2.5 sm:py-1.5 sm:text-sm md:px-3 md:py-2'
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
                        className='w-auto px-0 text-base leading-[26px] font-medium tracking-normal md:text-lg md:leading-[28px]'
                        onClick={handleToggleText}
                     >
                        {isFullTextVisible ? 'View less' : 'View more'}
                     </Button>
                  </Text>

                  <div className='flex flex-col gap-y-3.5 md:gap-y-4'>
                     <Text as='p' variant='textLmedium' className='text-[var(--color-neutral-300)]'>
                        Shipping Available
                     </Text>
                     <div className='flex w-full flex-col gap-y-2 rounded-md border p-3 sm:w-[260px] sm:p-4 md:w-[280px] md:p-5'>
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
            <Card className='max-h-[470px] w-full rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-4 text-[var(--color-base-white)] sm:max-w-[350px] sm:p-6 md:max-w-[380px] md:p-7 lg:max-w-[422px]'>
               <CardContent className='flex flex-col gap-y-5 px-0 sm:gap-y-6 md:gap-y-7 lg:gap-y-8'>
                  <ColorPicker
                     colors={product.variants.map(variant => ({
                        name: variant.color,
                     }))}
                     selectedColor={selectedColor}
                     setSelectedColor={setSelectedColor}
                  />
                  <QuantityPicker quantity={quantity} setQuantity={setQuantity} stock={stock} />
                  <Subtotal quantity={quantity} price={product.price} />
                  <Button
                     variant='stroke'
                     size='XXL'
                     className='md:text-md flex h-[48px] w-full items-center gap-2 text-xs sm:text-sm md:h-[52px]'
                     onClick={handleAddToCart}
                     disabled={loading || stock === 0 || quantity === 0}
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
