'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import ProductList from '@/components/ProductList'
import TotalList from '@/components/TotalList'
import { Button } from '@/components/ui/button'
import CheckCircleIcon from '@/components/icons/CheckCircleIcon'
import { useRouter, useSearchParams } from 'next/navigation'
import { SessionDetails } from '@/types/SessionDetails'
import { useSession } from 'next-auth/react'
import useFetch from '@/hooks/useFetch'

const PaymentSuccessPage = () => {
   const router = useRouter()
   const searchParams = useSearchParams()
   const sessionId = searchParams?.get('sessionId') || ''
   const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null)
   const { data: session } = useSession()
   const { postData, patchData, deleteData } = useFetch(null, {}, true)

   useEffect(() => {
      const fetchSessionDetails = async () => {
         if (!sessionId) return

         const response = await fetch(`/api/session-details?sessionId=${sessionId}`)
         const data = await response.json()

         console.log('Payment - API Response:', data)

         setSessionDetails({
            transactionDate: new Date(data.created * 1000).toLocaleString('en-US', {
               weekday: 'long',
               year: 'numeric',
               month: 'long',
               day: 'numeric',
               hour: '2-digit',
               minute: '2-digit',
               second: '2-digit',
            }),
            paymentIntentId: data.paymentIntentId,
            status: data.status,
            amount: data.amount_total / 100,
            paymentMethod: data.paymentMethod,
            shippingMethod: data.shippingMethod,
            productProtectionPrice: data.productProtectionPrice,
            shippingPrice: data.shippingPrice,
            shippingInsurancePrice: data.shippingInsurancePrice,
            serviceFees: data.serviceFees,
            items: data.products,
         })
      }

      fetchSessionDetails()
   }, [sessionId])

   useEffect(() => {
      console.log('Payment - Finalizing order with:', sessionDetails)

      const finalizeOrder = async () => {
         if (!sessionDetails || !sessionDetails.items.length) return

         try {
            const checkOrder = await fetch(`/api/orders/exists?paymentIntentId=${sessionDetails.paymentIntentId}`)
            const { exists } = await checkOrder.json()

            if (exists) return

            await postData('/api/orders', {
               userId: session?.user?.id,
               paymentIntentId: sessionDetails.paymentIntentId,
               status: sessionDetails.status,
               items: sessionDetails.items.map(item => ({
                  productId: item.id,
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price,
               })),
               purchaseDate: sessionDetails.transactionDate,
            })

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
                  <p className='text-lg font-medium text-[var(--color-neutral-900)]'>Transaction Date:</p>
                  <span className='text-base font-medium text-[var(--color-neutral-100)]'>
                     {sessionDetails.transactionDate}
                  </span>
               </div>

               <Separator className='my-6 bg-[var(--color-gray-800)]' />
               <div className='flex flex-col'>
                  <div className='flex flex-col gap-y-4'>
                     <p className='text-lg font-medium text-[var(--color-neutral-900)]'>Payment Method:</p>
                     <span className='text-base font-medium text-[var(--color-neutral-100)]'>
                        {sessionDetails.paymentMethod}
                     </span>
                  </div>
                  <Separator className='my-6 bg-[var(--color-gray-800)]' />
                  <div className='flex flex-col gap-y-4'>
                     <p className='text-lg font-medium text-[var(--color-neutral-900)]'>Shipping Method: </p>
                     <span className='text-base font-medium text-[var(--color-neutral-100)]'>
                        {sessionDetails.shippingMethod}
                     </span>
                  </div>
                  <Separator className='my-6 bg-[var(--color-gray-800)]' />
               </div>
               <div className='flex flex-col gap-y-4'>
                  <p className='text-lg font-medium text-[var(--color-neutral-900)]'>Your Order</p>
                  <ProductList
                     items={sessionDetails.items}
                     showCheckbox={false}
                     showTrashIcon={false}
                     onQuantityChange={undefined}
                     showNotes={false}
                  />
                  <TotalList
                     items={sessionDetails.items}
                     productProtectionPrice={sessionDetails.productProtectionPrice}
                     shippingPrice={sessionDetails.shippingPrice}
                     shippingInsurancePrice={sessionDetails.shippingInsurancePrice}
                     serviceFees={sessionDetails.serviceFees}
                     showCheckoutButton={false}
                     isCheckoutPage={true}
                  />
               </div>
               <div className='flex justify-between gap-y-4 text-center'>
                  <p className='text-lg font-medium text-[var(--color-neutral-900)]'>Status:</p>
                  <Button
                     variant='fill'
                     size='XS'
                     className='pointer-events-none bg-[var(--color-success-50)] text-white'
                  >
                     Success
                  </Button>
               </div>

               <div className='text-center'>
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
