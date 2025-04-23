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

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const CheckoutPage = () => {
   const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null)
   const [mainAddress, setMainAddress] = useState<Address | null>(null)
   const [isNoteVisible, setIsNoteVisible] = useState<number | null>(null)
   const [protectedItems, setProtectedItems] = useState<number[]>([])
   const [error, setError] = useState<string | null>(null)
   const router = useRouter()
   const protectionCostPerItem = 1

   const toggleProtection = (id: number) => {
      setProtectedItems(prevState =>
         prevState.includes(id) ? prevState.filter(itemId => itemId !== id) : [...prevState, id],
      )
   }

   useEffect(() => {
      const checkoutItems = JSON.parse(localStorage.getItem('checkoutItems') || '[]')

      const validateCheckoutItems = async () => {
         try {
            const response = await fetch('/api/validate-checkout', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ items: checkoutItems }),
            })

            const data = await response.json()

            if (!response.ok) {
               setError(data.error)
               return
            }

            setOrderSummary({
               items: data.validatedItems.map((item: any) => ({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  stock: item.stock,
                  imageUrl: item.imageUrl,
                  categoryName: item.categoryName,
               })),
               totalAmount: data.validatedItems.reduce((sum: number, item: any) => sum + item.quantity * item.price, 0),
            })
         } catch (error) {
            setError('Something went wrong while validating checkout items. Please try again.')
         }
      }

      validateCheckoutItems()
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
      const stripe = await stripePromise

      const orderDetails = {
         items: orderSummary.items,
         productProtectionPrice: calculateProtectionCost(),
         shippingPrice: 5,
         shippingInsurancePrice: 6,
         serviceFees: 0.5,
         grandTotal: orderSummary.totalAmount + calculateProtectionCost() + 5 + 6 + 0.5,
         paymentMethod: 'Stripe (Credit Card)',
         shippingMethod: 'NexusHub Courier',
      }

      localStorage.setItem('orderSummary', JSON.stringify(orderDetails))

      const response = await fetch('/api/create-checkout-session', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            items: orderSummary.items.map(item => ({
               name: item.name,
               price: item.price,
               quantity: item.quantity,
            })),
         }),
      })

      const { id } = await response.json()

      const { error } = await stripe?.redirectToCheckout({ sessionId: id })
      if (error) {
         console.error('Stripe checkout error:', error)
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
                     <h2 className='text-lg font-medium text-[var(--color-neutral-900)]'>Total Product</h2>
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
