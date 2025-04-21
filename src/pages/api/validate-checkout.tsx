import { PrismaClient } from '../../generated/prisma'

const prisma = new PrismaClient()

export default async function handler(req, res) {
   const userId = req.body.userId 
   const selectedItems = req.body.items

   try {
      console.log('User ID:', userId) 
      console.log('Selected items from frontend:', selectedItems)

      const cart = await prisma.cart.findFirst({
         where: { userId },
         include: {
            items: {
               include: { product: true },
            },
         },
      })

      console.log('User cart:', cart) // Log danych koszyka

      if (!cart) {
         console.error('No cart found for user')
         return res.status(400).json({ error: 'Cart not found' })
      }

      const validatedItems = selectedItems.map(item => {
         const cartItem = cart.items.find(ci => ci.productId === item.id)

         if (!cartItem) {
            throw new Error(`Product with ID ${item.id} not found in cart`)
         }

         // Weryfikacja ceny
         if (cartItem.product.price !== item.price) {
            throw new Error(`Price mismatch for product ID ${item.id}`)
         }

         // Weryfikacja dostępności w magazynie
         if (cartItem.product.stock < item.quantity) {
            throw new Error(`Insufficient stock for product ID ${item.id}`)
         }

         // Weryfikacja ilości
         if (item.quantity > cartItem.quantity) {
            throw new Error(`Requested quantity exceeds cart quantity for product ID ${item.id}`)
         }

         return {
            id: cartItem.product.id,
            name: cartItem.product.name,
            price: cartItem.product.price,
            quantity: item.quantity,
            stock: cartItem.product.stock,
            imageUrl: cartItem.product.imageUrl[0], // Pierwszy obraz jako string
            categoryName: item.categoryName,
         }
      })

      //   const validatedItems = selectedItems.map(item => {
      //      const cartItem = cart.items.find(ci => ci.productId === item.id)

      //      if (!cartItem) {
      //         console.error(`Product not found in cart: ${item.id}`)
      //      } else if (cartItem.quantity < item.quantity) {
      //         console.error(`Invalid quantity for product: ${item.id}`)
      //      } else if (cartItem.product.stock < item.quantity) {
      //         console.error(`Insufficient stock for product: ${item.id}`)
      //      }

      //      if (!cartItem || cartItem.quantity < item.quantity || cartItem.product.stock < item.quantity) {
      //         throw new Error(`Invalid item: ${item.name}`)
      //      }

      //      console.log('Validated product:', {
      //         ...cartItem.product,
      //         quantity: item.quantity,
      //      })

      //      return {
      //         ...cartItem.product,
      //         quantity: item.quantity,
      //      }
      //   })

      //   console.log('All validated items:', validatedItems) // Log zwróconych danych

      return res.status(200).json({ success: true, validatedItems })
   } catch (error) {
      console.error('Error during validation:', error.message)
      return res.status(400).json({ error: error.message })
   }
}
