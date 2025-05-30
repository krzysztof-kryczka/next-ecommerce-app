'use client'

import React, { JSX, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import ProductList from '@/components/ProductList'
import TotalList from '@/components/TotalList'
import { Button } from '@/components/ui/button'
import CheckCircleIcon from '@/components/icons/CheckCircleIcon'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import useFetch from '@/hooks/useFetch'
import { SessionDetails } from '@/types/SessionDetails'
import Text from '@/components/ui/text'
import useAuthFetch from '@/hooks/useAuthFetch'

const PaymentSuccessPage = (): JSX.Element => {
   const router = useRouter()
   const searchParams = useSearchParams()
   const sessionId = searchParams?.get('sessionId') || ''
   const { data: session } = useSession()
   const { postData, patchData, deleteData } = useFetch(
      null,
      {
         headers: {
            Authorization: `Bearer ${session?.accessToken}`,
         },
      },
      true,
   )
   const { fetchWithAuth } = useAuthFetch()
   const { data: dataSessionDetails } = useFetch<SessionDetails>(`/api/session-details?sessionId=${sessionId}`)
   const sessionDetails = Array.isArray(dataSessionDetails) ? dataSessionDetails[0] : dataSessionDetails

   useEffect(() => {
      // console.log('Payment - Finalizing order with:', sessionDetails)

      const finalizeOrder = async () => {
         if (!sessionDetails) return
         try {
            const orderExists = (await fetchWithAuth<{ exists: boolean }>(
               `/api/orders/exists?paymentIntentId=${sessionDetails.paymentIntentId}`,
               {},
               true,
            )) as { exists: boolean } | null

            if (orderExists?.exists === true) {
               return
            }

            await postData(
               '/api/orders',
               {
                  userId: session?.user?.id,
                  paymentIntentId: sessionDetails.paymentIntentId,
                  status: sessionDetails.status,
                  items: sessionDetails.products.map(item => {
                     console.log('Order item:', item)
                     return {
                        productId: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                     }
                  }),
                  purchaseDate: sessionDetails.transactionDate,
               },
               {
                  Authorization: `Bearer ${session?.accessToken}`,
               },
            )

            sessionStorage.removeItem('userTransactionsCache')

            await patchData('/api/update-stock', {
               items: sessionDetails.products.map(item => {
                  console.log('Processing item:', item)
                  return {
                     variantId: item.variantId,
                     quantityPurchased: item.quantity,
                  }
               }),
            })

            await deleteData('/api/clear-cart', { items: sessionDetails.products })

            localStorage.removeItem('checkoutItems')
         } catch (error) {
            console.error('❌ Error finalizing order:', error)
         }
      }

      finalizeOrder()
   }, [sessionDetails])

   if (!sessionDetails) {
      return <p>Loading payment details...</p>
   }

   return (
      <div className='mx-auto flex max-w-[1440px] flex-col gap-y-8 px-4 pb-10 sm:px-6 md:px-10'>
         <Card className='rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-6'>
            <CardHeader className='flex flex-col items-center gap-y-6 text-center'>
               <CheckCircleIcon />
               <CardTitle className='text-[28px] font-medium text-[var(--color-neutral-900)]'>
                  Thanks for Your Order!
               </CardTitle>
               <CardDescription className='text-base font-medium text-[var(--color-neutral-100)]'>
                  {sessionDetails.paymentIntentId}
               </CardDescription>
            </CardHeader>

            <CardContent className='px-0'>
               <div className='flex flex-col gap-y-4'>
                  <Text as='p' variant='textLmedium' className='text-[var(--color-neutral-900)]'>
                     Transaction Date:
                  </Text>
                  <Text as='span' variant='textMmedium' className='text-[var(--color-neutral-100)]'>
                     {sessionDetails?.created
                        ? new Date(sessionDetails.created * 1000).toLocaleString('en-US', {
                             weekday: 'long',
                             year: 'numeric',
                             month: 'long',
                             day: 'numeric',
                             hour: '2-digit',
                             minute: '2-digit',
                             second: '2-digit',
                          })
                        : 'Loading...'}
                  </Text>
               </div>

               <Separator className='my-6 bg-[var(--color-gray-800)]' />
               <div className='flex flex-col'>
                  <div className='flex flex-col gap-y-4'>
                     <Text as='p' variant='textLmedium' className='text-[var(--color-neutral-900)]'>
                        Payment Method:
                     </Text>
                     <Text as='span' variant='textMmedium' className='text-[var(--color-neutral-100)]'>
                        {sessionDetails.paymentMethod}
                     </Text>
                  </div>
                  <Separator className='my-6 bg-[var(--color-gray-800)]' />
               </div>
               <div className='flex flex-col gap-y-4'>
                  <Text as='p' variant='textLmedium' className='text-[var(--color-neutral-900)]'>
                     Your Order
                  </Text>
                  <ProductList
                     items={sessionDetails.products}
                     showCheckbox={false}
                     showTrashIcon={false}
                     onQuantityChange={undefined}
                     showNotes={false}
                  />
                  <TotalList
                     items={sessionDetails.products}
                     productProtectionPrice={sessionDetails.productProtectionPrice}
                     shippingPrice={sessionDetails.shippingPrice}
                     shippingInsurancePrice={sessionDetails.shippingInsurancePrice}
                     serviceFees={sessionDetails.serviceFees}
                     showCheckoutButton={false}
                     isCheckoutPage={true}
                  />
               </div>
               <div className='flex justify-between gap-y-4 text-center'>
                  <Text as='p' variant='textLmedium' className='text-[var(--color-neutral-900)]'>
                     Status:
                  </Text>
                  <Button
                     variant='fill'
                     size='XS'
                     className='pointer-events-none bg-[var(--color-success-50)] text-white'
                  >
                     Success
                  </Button>
               </div>

               <div className='pt-6 text-center'>
                  <Button variant='fill' size='XXL' className='w-full' onClick={() => router.push('/products')}>
                     Continue Shopping
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
   )
}

export default PaymentSuccessPage
