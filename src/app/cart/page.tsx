'use client'

import { JSX, useEffect, useState } from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import { Card, CardHeader } from '@/components/ui/card'
import { toast } from 'react-toastify'
import { Product } from '@/types/Product'
import ProductList from '@/components/ProductList'
import TotalList from '@/components/TotalList'
import { useRouter } from 'next/navigation'
import useFetch from '@/hooks/useFetch'
import Text from '@/components/ui/text'
import ErrorMessage from '@/components/ui/ErrorMessage'

const CartPage = (): JSX.Element => {
   const [cartItems, setCartItems] = useState<Product[]>([])
   const [selectedItems, setSelectedItems] = useState<number[]>([])
   const [isSelectAllChecked, setIsSelectAllChecked] = useState(false)
   const [isNoteVisible, setIsNoteVisible] = useState<number | null>(null)
   const { data, error, deleteData, patchData } = useFetch<Product[]>('/api/cart')
   const router = useRouter()

   useEffect(() => {
      if (!data || Object.keys(data).length === 0) {
         return
      }
      if (typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
         setCartItems(data.items)
      } else {
         console.warn('⚠️ Unexpected cart format:', data)
      }
   }, [data])

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
         const result = await patchData('/api/cart', { productId: id, quantity })

         if (result) {
            setCartItems(prevCart => prevCart.map(item => (item.id === id ? { ...item, quantity } : item)))
            toast.success('Quantity updated!')
         } else {
            toast.error('Failed to update quantity.')
         }
      } catch (error) {
         console.error(`❌ Error updating quantity: ${error}`)
         toast.error('An error occurred while updating quantity.')
      }
   }

   const removeFromCart = async (id: number) => {
      try {
         const result = await deleteData('/api/cart', { productId: id })
         if (result) {
            setCartItems(prevCart => prevCart.filter(item => item.id !== id))
            setSelectedItems(prevSelected => prevSelected.filter(itemId => itemId !== id))
            toast.success('Item removed!')
         } else {
            toast.error('Failed to remove item.')
         }
      } catch (error) {
         console.error(`❌ Error removing item: ${error}`)
         toast.error('An error occurred while removing the item.')
      }
   }

   const handleCheckout = () => {
      if (cartItems.length === 0) {
         return
      }
      const selectedProducts =
         selectedItems.length > 0 ? cartItems.filter(item => selectedItems.includes(item.id)) : cartItems
      localStorage.setItem('checkoutItems', JSON.stringify(selectedProducts))
      router.push('/checkout')
   }

   if (error) {
      return <ErrorMessage sectionName='cart.' errorDetails={error} />
   }

   return (
      <div className='mx-auto flex max-w-[1440px] flex-col gap-y-8 px-4 pb-10 sm:px-6 md:px-8 lg:px-10'>
         <Breadcrumb
            paths={[
               { name: 'Home', href: '/' },
               { name: 'Cart', href: '/cart' },
            ]}
         />
         {cartItems.length > 0 && (
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
         )}
         <div className='grid gap-x-6 sm:grid-rows-2 sm:gap-x-8 md:grid-rows-2 md:gap-x-10 lg:grid-cols-[3fr_1fr] lg:gap-x-12'>
            {/* Product List */}
            <ProductList
               items={cartItems.map(item => ({
                  id: item.id,
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price,
                  stock: item.stock,
                  imageUrl: Array.isArray(item.imageUrl) ? item.imageUrl[0] : item.imageUrl,
                  categoryName: item.categoryName || 'Unknown',
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
            <div className='w-full sm:w-[350px] md:w-[400px] lg:w-[423px]'>
               <Card className='rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-6'>
                  <CardHeader className='gap-0 px-0'>
                     <Text as='h2' variant='textLmedium' className='text-[var(--color-neutral-900)]'>
                        Total Product
                     </Text>
                  </CardHeader>
                  <TotalList
                     items={cartItems}
                     selectedItems={selectedItems}
                     showCheckoutButton={cartItems.length > 0}
                     onCheckout={handleCheckout}
                     isCheckoutPage={false}
                  />
               </Card>
            </div>
         </div>
      </div>
   )
}

export default CartPage
