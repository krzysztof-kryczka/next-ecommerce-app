import { useState } from 'react'
import useAuthFetch from '@/hooks/useAuthFetch'
import { toast } from 'react-toastify'

type UseAddToCart = {
   addToCart: (productId: number, quantity: number) => Promise<void>
   loading: boolean
}

export const useAddToCart = (): UseAddToCart => {
   const { fetchWithAuth } = useAuthFetch()
   const [loading, setLoading] = useState(false)

   const addToCart = async (productId: number, quantity: number): Promise<void> => {
      try {
         setLoading(true)
         const cartItem = {
            productId,
            quantity,
         }

         const response: Response | null = await fetchWithAuth('/api/cart', {
            method: 'POST',
            body: JSON.stringify(cartItem),
         })

         if (!response) {
            toast.error('You must be logged in to add items to the cart.')
            return
         }

         const responseData = await response.json()

         if (response.ok) {
            toast.success(responseData.message || 'Product added to cart!')
         } else {
            toast.error(responseData.message || 'Failed to add product to cart.')
         }
      } catch (error) {
         console.error('Error adding product to cart:', error)
         toast.error('Something went wrong.')
      } finally {
         setLoading(false)
      }
   }

   return { addToCart, loading }
}
