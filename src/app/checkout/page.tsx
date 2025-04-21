'use client'
import React, { useState, useEffect } from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import ProductList from '@/components/ProductList'
import { OrderSummary } from '@/types/OrderSummary'

const CheckoutPage = () => {
   const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null)

   const [isNoteVisible, setIsNoteVisible] = useState<number | null>(null)
   const [protectedItems, setProtectedItems] = useState<number[]>([])
   const [error, setError] = useState<string | null>(null)

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

            const totalAmount = data.validatedItems.reduce(
               (sum: number, item: any) => sum + item.quantity * item.price,
               0,
            )

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
                     protectionCost={1}
                  />
               ) : (
                  <p>Loading your order summary...</p>
               )}
            </div>
         </div>
      </div>
   )
}

export default CheckoutPage
