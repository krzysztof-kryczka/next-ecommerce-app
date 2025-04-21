'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Breadcrumb from '@/components/Breadcrumb'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'react-toastify'
import { Product } from '@/types/Product'
import Link from 'next/link'
import ProductList from '@/components/ProductList'

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
         const data = await response.json()

         if (Array.isArray(data.items)) {
            const validatedItems = data.items.map((item: Product) => ({
               ...item,
               price: typeof item.price === 'number' ? item.price : 0,
               quantity: typeof item.quantity === 'number' ? item.quantity : 1,
               stock: typeof item.stock === 'number' ? item.stock : 0,
               imageUrl: Array.isArray(item.imageUrl) ? item.imageUrl[0] : item.imageUrl || '',
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
      toast.info('All items selected.')
   }

   const deselectAll = () => {
      setSelectedItems([])
      toast.info('All items deselected.')
   }

   const updateQuantity = async (id: number, quantity: number) => {
      try {
         const response = await fetch('/api/cart', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: id, quantity }),
         })
         const data = await response.json()

         if (response.ok) {
            fetchCart()
            toast.success(data.message)
         } else {
            toast.error(data.message)
         }
      } catch (error) {
         console.error('Error updating quantity:', error)
         toast.error('An error occurred while updating quantity.')
      }
   }

   const removeFromCart = async (id: number) => {
      try {
         const response = await fetch('/api/cart', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: id }),
         })
         const data = await response.json()

         if (response.ok) {
            fetchCart()
            toast.success(data.message)
         } else {
            toast.error(data.message)
         }
      } catch (error) {
         console.error('Error removing item:', error)
         toast.error('An error occurred while removing the item.')
      }
   }

   const handleCheckout = () => {
      const selectedProducts =
         selectedItems.length > 0 ? cartItems.filter(item => selectedItems.includes(item.id)) : cartItems
      localStorage.setItem('checkoutItems', JSON.stringify(selectedProducts))
   }

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
                  if (isSelectAllChecked) {
                     deselectAll()
                  } else {
                     selectAll()
                  }
                  setIsSelectAllChecked(!isSelectAllChecked)
               }}
               id='selectAllCheckbox'
            />
            <label htmlFor='selectAllCheckbox' className='text-base font-medium text-[var(--color-neutral-900)]'>
               {isSelectAllChecked ? 'Deselect all' : 'Select all'}
            </label>
         </div>

         <div className='grid grid-cols-1 gap-x-12 lg:grid-cols-[3fr_1fr]'>
            {/* Product List */}
            <ProductList
               items={cartItems.map(item => ({
                  id: item.id,
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price,
                  stock: item.stock,
                  imageUrl: Array.isArray(item.imageUrl) ? item.imageUrl[0] : item.imageUrl,
                  categoryName: item.categoryName,
               }))}
               showCheckbox={true}
               selectedItems={selectedItems}
               toggleSelectItem={toggleSelectItem}
               showTrashIcon={true}
               onRemove={removeFromCart}
               onQuantityChange={updateQuantity}
               showNotes={true}
               isNoteVisible={isNoteVisible}
               toggleNote={setIsNoteVisible}
            />

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
                     <Link href='/checkout' onClick={handleCheckout}>
                        <Button
                           variant='fill'
                           size='XXL'
                           className='w-full bg-[var(--color-primary-400)] py-3.5 text-base font-medium text-[var(--color-base-gray)]'
                        >
                           Checkout
                        </Button>
                     </Link>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   )
}

export default CartPage
