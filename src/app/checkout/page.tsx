'use client'
import React, { useState, useEffect } from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import ProductList from '@/components/ProductList'
import { OrderSummary } from '@/types/OrderSummary'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import ShieldCrossIcon from '@/components/icons/ShieldCrossIcon'
import StripeIcon from '@/components/icons/StripeIcon'
import ShippingAddress from '@/components/ShippingAddress'
import { Address } from '@/types/Address'
import TotalList from '@/components/TotalList'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { Item } from '@/types/Item'
import Text from '@/components/ui/text'
import { useCurrency } from '@/context/CurrencyContext'
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const CheckoutPage = () => {
   const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null)
   const [mainAddress, setMainAddress] = useState<Address | null>(null)
   const [isNoteVisible, setIsNoteVisible] = useState<number | null>(null)
   const [protectedItems, setProtectedItems] = useState<number[]>([])
   const [error, setError] = useState<string | null>(null)
   const { data: session, status } = useSession()
   const { currency, currencySymbols } = useCurrency()
   const router = useRouter()
   const protectionCostPerItem = 1

   useEffect(() => {
      if (status === 'unauthenticated') {
         toast.error('🚫 Musisz się zalogować, aby dokonać zakupu!')
         setTimeout(() => router.push('/login'), 2000)
      }
   }, [status])

   const toggleProtection = (id: number) => {
      setProtectedItems(prevState =>
         prevState.includes(id) ? prevState.filter(itemId => itemId !== id) : [...prevState, id],
      )
   }

   useEffect(() => {
      try {
         const checkoutItems = JSON.parse(localStorage.getItem('checkoutItems') || '[]')

         if (!Array.isArray(checkoutItems) || checkoutItems.length === 0) {
            setError('❌ Your cart is empty. Redirecting to cart...')
            setTimeout(() => router.push('/cart'), 2000)
            return
         }

         setOrderSummary({
            items: checkoutItems,
            totalAmount: checkoutItems.reduce((sum: number, item: any) => sum + item.quantity * item.price, 0),
         })
      } catch (error) {
         console.error('❌ Error loading checkout items:', error)
         setError('❌ Failed to load checkout items. Redirecting...')
         setTimeout(() => router.push('/cart'), 2000)
      }
   }, [])

   // const calculateProtectionCost = () => {
   //    if (!orderSummary || !protectedItems.length) return 0

   //    return orderSummary.items
   //       .filter(item => protectedItems.includes(item.id))
   //       .reduce((total, item) => total + item.quantity * protectionCostPerItem, 0) // Obliczanie kosztu ochrony na podstawie protectedItems dla każdego produktu (ilość)  z osobna
   // }

   const calculateProtectionCost = () => {
      if (!orderSummary || !protectedItems.length) return 0

      return orderSummary.items
         .filter(item => protectedItems.includes(item.id))
         .reduce((total, item) => total + protectionCostPerItem, 0) // Stały koszt $1 za każdy produkt
   }

   const handleCheckout = async () => {
      if (status !== 'authenticated') {
         return toast.error('🚫 Musisz się zalogować, aby kontynuować checkout!')
      }
      if (!orderSummary || !orderSummary.items.length) {
         return toast.error('⛔ No items selected for checkout.')
      }

      try {
         const validateResponse = await fetch('/api/validate-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: orderSummary.items }),
         })

         const validateData = await validateResponse.json()

         console.log('API Response:', validateData)

         if (!validateResponse.ok) {
            return toast.error(`🚫 ${validateData.error || 'Invalid checkout items.'}`)
         }

         const orderDetails = {
            items: validateData.validatedItems,
            currency,
            productProtectionPrice: calculateProtectionCost(),
            shippingPrice: 5,
            shippingInsurancePrice: 6,
            serviceFees: 0.5,
            grandTotal:
               validateData.validatedItems.reduce((sum: number, item: Item) => sum + item.quantity * item.price, 0) +
               calculateProtectionCost() +
               5 +
               6 +
               0.5,
            paymentMethod: 'Stripe (Credit Card)',
            shippingMethod: 'NexusHub Courier',
         }

         localStorage.setItem('orderSummary', JSON.stringify(orderDetails))

         const stripe = await stripePromise
         const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderDetails),
         })

         if (!response.ok) {
            throw new Error('⚠️ Failed to create Stripe session.')
         }

         const { id } = await response.json()
         const stripeResponse = await stripe?.redirectToCheckout({ sessionId: id })
         console.error('❌ Stripe checkout error:', stripeResponse?.error?.message)
         toast.error('⚠️ Failed to redirect to payment.')
      } catch (error) {
         console.error('❌ Checkout process failed:', error)
         toast.error('❌ Something went wrong during checkout.')
      }
   }

   return (
      <div className='mx-auto flex max-w-[1440px] flex-col gap-y-8 px-4 pb-10 sm:px-6 md:px-10'>
         {error && <div className='error-banner'>{error}</div>}
         <Breadcrumb
            paths={[
               { name: 'Home', href: '/' },
               { name: 'Cart', href: '/cart' },
               { name: 'Checkout', href: '/checkout' },
            ]}
         />
         <div className='grid grid-cols-1 gap-x-12 lg:grid-cols-[3fr_1fr]'>
            {/* Lista produktów */}
            <div className='flex w-[889px] flex-col gap-y-8'>
               {orderSummary ? (
                  <ProductList
                     items={orderSummary.items}
                     showCheckbox={false}
                     showTrashIcon={false}
                     onQuantityChange={(id, quantity) => {
                        // Aktualizacja ilości produktu w stanie
                        setOrderSummary(prev => {
                           if (!prev) return prev
                           const updatedItems = prev.items.map(item => (item.id === id ? { ...item, quantity } : item))
                           const updatedTotal = updatedItems.reduce((sum, item) => sum + item.quantity * item.price, 0)

                           return { ...prev, items: updatedItems, totalAmount: updatedTotal }
                        })
                     }}
                     showNotes={true}
                     isNoteVisible={isNoteVisible}
                     toggleNote={setIsNoteVisible}
                     showProtectionOption={true}
                     protectedItems={protectedItems}
                     toggleProtection={toggleProtection}
                     protectionCost={protectionCostPerItem}
                  />
               ) : (
                  <p>Loading your order summary...</p>
               )}

               <div className='flex flex-col gap-y-6'>
                  {/* Sekcja adresu wysyłki */}
                  <ShippingAddress onMainAddressSelect={setMainAddress} />
                  {mainAddress && (
                     <div className='mt-4'>
                        <p>Selected Shipping Address:</p>
                        <p>{mainAddress.addressLine}</p>
                     </div>
                  )}
                  {/* Sekcja metody wysyłki */}
                  Shipping
                  <Card className='w-full rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-3'>
                     <CardContent>
                        <div className='flex items-start gap-2'>
                           <ShieldCrossIcon />
                           <div className='flex flex-col gap-y-1'>
                              <p className='text-sm font-medium text-[var(--color-neutral-900)] sm:text-base'>
                                 NexusHub Courier
                              </p>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
                  {/* Sekcja metody płatności */}
                  Payment Method
                  <Card className='w-full rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-3'>
                     <CardContent>
                        <div className='flex items-start gap-2'>
                           <StripeIcon />
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </div>
            <div className='w-[423px]'>
               <Card className='rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-6'>
                  <CardHeader className='gap-0 px-0'>
                     <Text as='h2' variant='textLmedium' className='text-[var(--color-neutral-900)]'>
                        Total Product
                     </Text>
                  </CardHeader>
                  {orderSummary ? (
                     <TotalList
                        items={orderSummary.items}
                        showCheckoutButton={true}
                        isCheckoutPage={true}
                        productProtectionPrice={calculateProtectionCost()}
                        shippingPrice={5}
                        shippingInsurancePrice={6}
                        serviceFees={0.5}
                        onCheckout={handleCheckout}
                     />
                  ) : (
                     <p>Loading total...</p>
                  )}
               </Card>
            </div>
         </div>
      </div>
   )
}

export default CheckoutPage
