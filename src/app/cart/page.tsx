'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Breadcrumb from '@/components/Breadcrumb'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Trash2Icon from '@/components/icons/Trash2Icon'
import QuantityPicker from '@/components/QuantityPicker'

type Product = {
   id: number
   name: string
   price: number
   imageUrl: string
   quantity: number
}

const CartPage = () => {
   const [cartItems, setCartItems] = useState<Product[]>([])
   const [selectedItems, setSelectedItems] = useState<number[]>([])
   const [isSelectAllChecked, setIsSelectAllChecked] = useState(false)
   const [isLoading, setIsLoading] = useState<boolean>(false)
   const [isNoteVisible, setIsNoteVisible] = useState<number | null>(null)


   // useEffect(() => {
      const fetchCart = async () => {
         setIsLoading(true)
         try {
            const response = await fetch('/api/cart', { method: 'GET' })

            if (!response.ok) {
               throw new Error(`HTTP error! Status: ${response.status}`)
            }

            const data = await response.json()

            if (Array.isArray(data.items)) {
               const validatedItems = data.items.map(item => ({
                  ...item,
                  price: typeof item.price === 'number' ? item.price : 0,
                  quantity: typeof item.quantity === 'number' ? item.quantity : 1,
                  imageUrl: item.imageUrl || '',
                  categoryName: item.categoryName,
               }))
               setCartItems(validatedItems)
            } else {
               console.error('Invalid cart data format:', data)
               setCartItems([]) // Ustawienie pustej tablicy w przypadku błędnych danych
            }
         } catch (error) {
            console.error('Error fetching cart:', error)
            setCartItems([])
         } finally {
            setIsLoading(false)
         }
         // fetchCart()
      }
   // }, [])

   useEffect(() => {
      fetchCart() // Wywołanie funkcji podczas montowania komponentu
   }, [])

   const toggleSelectItem = (id: number) => {
      setSelectedItems(prev => (prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]))
   }

   const selectAll = () => {
      setSelectedItems(cartItems.map(item => item.id))
   }

   const updateQuantity = async (id: number, quantity: number) => {}

   const removeFromCart = async (id: number) => {}

   if (isLoading) return <div className='text-center'>Loading cart...</div>

   return (
      <div className='mx-auto flex max-w-[1440px] flex-col gap-y-8 px-4 pb-10 sm:px-6 md:px-10'>
         <Breadcrumb
            paths={[
               { name: 'Home', href: '/' },
               { name: 'Cart', href: '/cart' },
            ]}
         />
         <div className='flex items-center gap-x-4'>
            <input
               type='checkbox'
               className='form-checkbox h-6 w-6 accent-[var(--color-blazeOrange-600)]'
               checked={isSelectAllChecked}
               onChange={() => {
                  selectAll()
                  setIsSelectAllChecked(!isSelectAllChecked)
               }}
               id='selectAllCheckbox'
            />
            <label htmlFor='selectAllCheckbox' className='text-base font-medium text-[var(--color-neutral-900)]'>
               Select all
            </label>
         </div>

         <div className='grid grid-cols-1 gap-x-12 lg:grid-cols-[3fr_1fr]'>
            {/* Product List */}
            <div className='flex w-[889px] flex-col gap-y-8'>
               {cartItems.map(item => (
                  <div key={item.id} className='flex items-center gap-x-8'>
                     {/* Checkbox */}
                     <input
                        type='checkbox'
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className='form-checkbox h-6 w-6 accent-[var(--color-blazeOrange-600)]'
                     />
                     {/* Karta Produktu */}
                     <Card className='w-full rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-3'>
                        <CardContent className='flex flex-col gap-y-6 px-0'>
                           <div className='flex items-start gap-x-8'>
                              {/* Image Card */}
                              <Card className='h-[138px] w-[172px] rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-3'>
                                 <img src={item.imageUrl} alt={item.name} className='h-[114px] w-[148px] rounded-md' />
                              </Card>
                              {/* Product Details */}
                              <div className='flex flex-1 flex-col gap-y-4'>
                                 <div className='flex flex-col gap-y-3'>
                                    <div className='flex items-center justify-between'>
                                       <p className='text-xl font-medium text-[var(--color-neutral-900)]'>
                                          {item.name}
                                       </p>
                                       {/* Trash Icon */}
                                       <Trash2Icon
                                          onClick={() => removeFromCart(item.id)}
                                          className='h-6 w-6 cursor-pointer text-[var(--color-blazeOrange-600)] hover:text-[var(--color-blazeOrange-800)]'
                                       />
                                    </div>

                                    <Button variant='fill' size='XS' disabled className=''>
                                       {item.categoryName || 'Unknown Category'}
                                    </Button>
                                 </div>

                                 <div className='flex items-center justify-between'>
                                    <p className='text-2xl text-[var(--color-neutral-900)]'>
                                       {typeof item.price === 'number'
                                          ? `$${item.price.toFixed(2)}`
                                          : 'Price unavailable'}
                                    </p>

                                    {/* Quantity and Write Note */}
                                    <div className='flex items-center justify-end gap-x-6'>
                                       {/* Write Note Toggle Button */}
                                       <button
                                          className='text-[16px] font-medium text-[var(--color-blazeOrange-600)] hover:text-[var(--color-blazeOrange-800)]'
                                          onClick={() => setIsNoteVisible(isNoteVisible === item.id ? null : item.id)}
                                       >
                                          Write Note
                                       </button>
                                       {/* Separator */}
                                       <div className=''>
                                          <div className='h-6'>
                                             <Separator
                                                orientation='vertical'
                                                className='w-[2px] bg-[var(--color-gray-800)]'
                                             />
                                          </div>
                                       </div>
                                       {/* Quantity Picker */}
                                       <div className='flex items-center gap-x-4'>
                                          <QuantityPicker
                                             quantity={item.quantity}
                                             setQuantity={newQuantity => updateQuantity(item.id, newQuantity)}
                                             stock={item.stock}
                                             showTitle={false}
                                             size='md'
                                             hideStock={true}
                                          />
                                       </div>
                                    </div>
                                 </div>

                                 {/* Rendering Write Note Pole Tekstowe */}
                                 {isNoteVisible === item.id && (
                                    <textarea
                                       placeholder='Write your note here...'
                                       className='mt-4 w-full rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-2 text-[16px] text-[var(--color-neutral-600)] placeholder:text-[var(--color-neutral-500)] focus:ring-2 focus:ring-[var(--color-blazeOrange-600)] focus:outline-none'
                                    />
                                 )}
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  </div>
               ))}
            </div>

            {/* Total */}
            <div className='w-[423px]'>
               {/* Total Product */}
               <Card className='rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-6'>
                  <CardContent className='px-0'>
                     <div className='flex flex-col gap-y-4'>
                        <h2 className='text-lg font-medium text-[var(--color-neutral-900)]'>Total Product</h2>

                        {/* Zaznaczone Produkty Cena */}
                        <div className='flex flex-col gap-y-2 text-base font-medium text-[var(--color-neutral-900)]'>
                           {selectedItems.length > 0
                              ? cartItems
                                   .filter(item => selectedItems.includes(item.id))
                                   .map(item => (
                                      <div key={item.id} className='flex justify-between'>
                                         <span>
                                            {item.name} ({item.quantity} × ${item.price.toFixed(2)})
                                         </span>
                                         <span>${(item.quantity * item.price).toFixed(2)}</span>
                                      </div>
                                   ))
                              : cartItems.map(item => (
                                   <div key={item.id} className='flex justify-between'>
                                      <span>
                                         {item.name} ({item.quantity} × ${item.price.toFixed(2)})
                                      </span>
                                      <span>${(item.quantity * item.price).toFixed(2)}</span>
                                   </div>
                                ))}
                        </div>
                     </div>
                     <div className='col-span-full my-6'>
                        <Separator className='bg-[var(--color-gray-800)]' />
                     </div>
                     <div className='align-center flex justify-between pb-6'>
                        <p className='text-lg font-medium text-[var(--color-neutral-900)]'>Subtotal:</p>
                        <p className='text-[28px] font-medium text-[var(--color-neutral-900)]'>
                           $
                           {selectedItems.length > 0
                              ? cartItems
                                   .filter(item => selectedItems.includes(item.id))
                                   .reduce((total, item) => total + item.price * item.quantity, 0)
                                   .toFixed(2)
                              : cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                        </p>
                     </div>
                     <Button
                        variant='fill'
                        size='XXL'
                        className='w-full bg-[var(--color-primary-400)] py-3.5 text-base font-medium text-[var(--color-base-gray)]'
                     >
                        Checkout
                     </Button>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   )
}

export default CartPage
